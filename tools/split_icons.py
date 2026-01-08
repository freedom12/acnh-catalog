"""
图标切割工具
从包含多个小图标的拼接图片中，根据蓝色缝隙将各个图标切割出来
"""

from PIL import Image
import os
import numpy as np
from typing import List, Tuple

def is_blue_pixel(pixel, threshold=100):
    """判断是否为蓝色像素（蓝色缝隙）"""
    if len(pixel) == 4:  # RGBA
        r, g, b, a = pixel
    else:  # RGB
        r, g, b = pixel
        a = 255
    
    # 蓝色特征：蓝色通道高，红绿通道低
    return b > threshold and r < 100 and g < 100 and a > 200

def find_blue_lines(image_array, direction='horizontal'):
    """
    查找蓝色分隔线
    direction: 'horizontal' 或 'vertical'
    返回分隔线的索引列表
    """
    height, width = image_array.shape[:2]
    blue_lines = []
    
    if direction == 'horizontal':
        # 检查每一行
        for y in range(height):
            row = image_array[y]
            # 如果这一行大部分像素是蓝色，认为是分隔线
            blue_count = sum(1 for pixel in row if is_blue_pixel(pixel))
            if blue_count > width * 0.5:  # 超过50%是蓝色
                blue_lines.append(y)
    else:  # vertical
        # 检查每一列
        for x in range(width):
            col = image_array[:, x]
            blue_count = sum(1 for pixel in col if is_blue_pixel(pixel))
            if blue_count > height * 0.5:
                blue_lines.append(x)
    
    return blue_lines

def merge_consecutive_lines(lines, max_gap=5):
    """合并连续的线条索引，返回区间"""
    if not lines:
        return []
    
    ranges = []
    start = lines[0]
    end = lines[0]
    
    for i in range(1, len(lines)):
        if lines[i] - end <= max_gap:
            end = lines[i]
        else:
            ranges.append((start, end))
            start = lines[i]
            end = lines[i]
    
    ranges.append((start, end))
    return ranges

def get_split_positions(lines_ranges):
    """从线条区间获取切割位置（取区间中点）"""
    return [int((start + end) / 2) for start, end in lines_ranges]

def split_image_into_icons(image_path, output_dir='output_icons'):
    """
    将拼接图片切割成单个图标
    """
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 读取图片
    img = Image.open(image_path)
    img_array = np.array(img)
    
    print(f"图片尺寸: {img.size}")
    print(f"图片模式: {img.mode}")
    
    # 查找水平和垂直的蓝色分隔线
    h_blue_lines = find_blue_lines(img_array, 'horizontal')
    v_blue_lines = find_blue_lines(img_array, 'vertical')
    
    print(f"检测到 {len(h_blue_lines)} 条水平蓝线")
    print(f"检测到 {len(v_blue_lines)} 条垂直蓝线")
    
    # 合并连续的线条，获取分隔区域
    h_ranges = merge_consecutive_lines(h_blue_lines)
    v_ranges = merge_consecutive_lines(v_blue_lines)
    
    print(f"水平分隔区域: {len(h_ranges)} 个")
    print(f"垂直分隔区域: {len(v_ranges)} 个")
    
    # 获取切割位置
    h_splits = get_split_positions(h_ranges)
    v_splits = get_split_positions(v_ranges)
    
    # 添加边界
    h_splits = [0] + h_splits + [img.height]
    v_splits = [0] + v_splits + [img.width]
    
    print(f"将切割成 {len(h_splits)-1} 行 x {len(v_splits)-1} 列")
    
    # 切割图标
    icon_count = 0
    for i in range(len(h_splits) - 1):
        for j in range(len(v_splits) - 1):
            top = h_splits[i]
            bottom = h_splits[i + 1]
            left = v_splits[j]
            right = v_splits[j + 1]
            
            # 跳过太小的区域（可能是边缘）
            if (bottom - top) < 10 or (right - left) < 10:
                continue
            
            # 裁剪图标
            icon = img.crop((left, top, right, bottom))
            
            # 检查是否为空白或纯蓝色区域
            icon_array = np.array(icon)
            non_transparent = icon_array[..., 3] > 0 if icon.mode == 'RGBA' else icon_array
            
            # 如果大部分是蓝色或透明，跳过
            if icon.mode == 'RGBA':
                visible_pixels = icon_array[icon_array[..., 3] > 100]
                if len(visible_pixels) < 100:  # 可见像素太少
                    continue
                blue_pixels = sum(1 for p in visible_pixels if is_blue_pixel(p))
                if blue_pixels > len(visible_pixels) * 0.8:  # 80%以上是蓝色
                    continue
            
            icon_count += 1
            output_path = os.path.join(output_dir, f'icon_{icon_count:03d}.png')
            icon.save(output_path)
            print(f"保存图标 {icon_count}: {output_path} (尺寸: {icon.size})")
    
    print(f"\n完成! 共切割出 {icon_count} 个图标，保存在 {output_dir} 目录")
    return icon_count

def auto_detect_and_split(image_path, output_dir='output_icons'):
    """
    自动检测并切割图标（处理透明背景和蓝色缝隙）
    """
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 读取图片
    img = Image.open(image_path)
    img_array = np.array(img)
    
    print(f"图片尺寸: {img.size}")
    print(f"图片模式: {img.mode}")
    
    height, width = img_array.shape[:2]
    
    # 创建一个掩码：标记非透明且非蓝色的像素
    if img.mode == 'RGBA':
        # 有效内容：不透明且不是蓝色
        valid_mask = np.zeros((height, width), dtype=bool)
        for y in range(height):
            for x in range(width):
                pixel = img_array[y, x]
                if pixel[3] > 100 and not is_blue_pixel(pixel):  # 不透明且非蓝色
                    valid_mask[y, x] = True
    else:
        # 如果没有透明通道，只检查蓝色
        valid_mask = np.ones((height, width), dtype=bool)
        for y in range(height):
            for x in range(width):
                if is_blue_pixel(img_array[y, x]):
                    valid_mask[y, x] = False
    
    # 查找连续的有效区域（使用连通组件分析）
    from scipy import ndimage
    labeled_array, num_features = ndimage.label(valid_mask)
    
    print(f"检测到 {num_features} 个连通区域")
    
    # 提取每个区域
    icon_count = 0
    for region_id in range(1, num_features + 1):
        # 找到该区域的边界
        region_coords = np.argwhere(labeled_array == region_id)
        if len(region_coords) == 0:
            continue
        
        y_min, x_min = region_coords.min(axis=0)
        y_max, x_max = region_coords.max(axis=0)
        
        # 跳过太小的区域
        width_region = x_max - x_min + 1
        height_region = y_max - y_min + 1
        
        if width_region < 10 or height_region < 10:
            continue
        
        # 裁剪图标（添加一点边距）
        padding = 2
        left = max(0, x_min - padding)
        top = max(0, y_min - padding)
        right = min(width, x_max + padding + 1)
        bottom = min(height, y_max + padding + 1)
        
        icon = img.crop((left, top, right, bottom))
        
        icon_count += 1
        output_path = os.path.join(output_dir, f'icon_{icon_count:03d}.png')
        icon.save(output_path)
        print(f"保存图标 {icon_count}: {output_path} (尺寸: {icon.size})")
    
    print(f"\n完成! 共切割出 {icon_count} 个图标，保存在 {output_dir} 目录")
    return icon_count

if __name__ == '__main__':
    import sys
    
    # 默认参数
    input_image = '../public/img/icon/139899.png'
    output_directory = 'output_icons'
    
    # 如果提供了命令行参数
    if len(sys.argv) > 1:
        input_image = sys.argv[1]
    if len(sys.argv) > 2:
        output_directory = sys.argv[2]
    
    if not os.path.exists(input_image):
        print(f"错误: 找不到图片文件 {input_image}")
        print("用法: python split_icons.py <图片路径> [输出目录]")
        sys.exit(1)
    
    print("="*60)
    print("图标切割工具")
    print("="*60)
    print(f"输入图片: {input_image}")
    print(f"输出目录: {output_directory}")
    print("="*60)
    print()
    
    # 尝试方法1：基于蓝色分隔线的网格切割
    print("方法1: 基于蓝色分隔线的网格切割")
    print("-"*60)
    try:
        count1 = split_image_into_icons(input_image, output_directory + '_grid')
    except Exception as e:
        print(f"方法1失败: {e}")
        count1 = 0
    
    print("\n" + "="*60)
    print("方法2: 基于连通区域的自动检测")
    print("-"*60)
    try:
        count2 = auto_detect_and_split(input_image, output_directory + '_auto')
    except Exception as e:
        print(f"方法2失败: {e}")
        count2 = 0
    
    print("\n" + "="*60)
    print("切割完成!")
    print(f"方法1（网格）: {count1} 个图标")
    print(f"方法2（自动）: {count2} 个图标")
    print("="*60)
