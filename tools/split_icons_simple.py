# -*- coding: utf-8 -*-
"""
简化版图标切割工具
使用更直观的方法来切割拼接图标
只依赖Pillow，不需要numpy和scipy
"""

from __future__ import print_function
from PIL import Image
import os

def split_icons_simple(image_path, output_dir='output_icons', padding=2):
    """
    简单直接的切割方法：
    1. 扫描图片，标记非透明非蓝色的像素
    2. 找出所有独立的矩形区域
    3. 裁剪并保存（保留周围的透明区域）
    """
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 读取图片
    img = Image.open(image_path)
    width, height = img.size
    pixels = img.load()
    
    print("图片尺寸: {} x {}".format(width, height))
    print("图片模式: {}".format(img.mode))
    
    # 创建一个布尔矩阵，标记有效像素
    valid = [[False] * width for _ in range(height)]
    
    for y in range(height):
        for x in range(width):
            pixel = pixels[x, y]
            
            # 判断是否为有效像素（非透明、非蓝色）
            if img.mode == 'RGBA':
                r, g, b, a = pixel
                # 透明度足够，且不是蓝色
                is_valid = (a > 100 and 
                           not (b > 100 and r < 100 and g < 100))
            else:
                r, g, b = pixel
                is_valid = not (b > 100 and r < 100 and g < 100)
            
            valid[y][x] = is_valid
    
    # 找出所有连通区域
    visited = [[False] * width for _ in range(height)]
    regions = []
    
    def flood_fill(start_x, start_y):
        """洪水填充算法，找出一个连通区域"""
        stack = [(start_x, start_y)]
        min_x, max_x = start_x, start_x
        min_y, max_y = start_y, start_y
        
        while stack:
            x, y = stack.pop()
            
            if x < 0 or x >= width or y < 0 or y >= height:
                continue
            if visited[y][x] or not valid[y][x]:
                continue
            
            visited[y][x] = True
            min_x = min(min_x, x)
            max_x = max(max_x, x)
            min_y = min(min_y, y)
            max_y = max(max_y, y)
            
            # 检查四个方向
            stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
        
        return (min_x, min_y, max_x, max_y)
    
    # 扫描找出所有区域
    print("\n扫描连通区域...")
    for y in range(height):
        for x in range(width):
            if valid[y][x] and not visited[y][x]:
                region = flood_fill(x, y)
                min_x, min_y, max_x, max_y = region
                
                # 计算区域大小
                w = max_x - min_x + 1
                h = max_y - min_y + 1
                
                # 过滤太小的区域
                if w >= 10 and h >= 10:
                    regions.append(region)
                    print("发现区域: ({}, {}) - ({}, {}), 尺寸: {}x{}".format(min_x, min_y, max_x, max_y, w, h))
    
    print("\n共发现 {} 个有效区域".format(len(regions)))
    
    # 辅助函数：检测是否为蓝色像素
    def is_blue(x, y):
        if x < 0 or x >= width or y < 0 or y >= height:
            return False
        pixel = pixels[x, y]
        if img.mode == 'RGBA':
            r, g, b, a = pixel
            return b > 100 and r < 100 and g < 100 and a > 200
        else:
            r, g, b = pixel
            return b > 100 and r < 100 and g < 100
    
    # 切割并保存每个区域
    print("\n开始切割...")
    saved_regions = set()  # 记录已保存的区域，避免重复
    saved_count = 0
    
    for idx, (min_x, min_y, max_x, max_y) in enumerate(regions, 1):
        # 向四个方向扩展，直到遇到蓝色线或边界
        # 向左扩展
        left = min_x
        while left > 0 and not is_blue(left - 1, min_y):
            left -= 1
        
        # 向右扩展
        right = max_x + 1
        while right < width and not is_blue(right, min_y):
            right += 1
        
        # 向上扩展
        top = min_y
        while top > 0 and not is_blue(min_x, top - 1):
            top -= 1
        
        # 向下扩展
        bottom = max_y + 1
        while bottom < height and not is_blue(min_x, bottom):
            bottom += 1
        
        # 检查是否已经保存过这个区域
        region_key = (left, top, right, bottom)
        if region_key in saved_regions:
            print("[{}/{}] 跳过重复区域: ({}, {}) - ({}, {})".format(idx, len(regions), left, top, right, bottom))
            continue
        
        saved_regions.add(region_key)
        saved_count += 1
        
        # 裁剪
        icon = img.crop((left, top, right, bottom))
        
        # 保存
        output_path = os.path.join(output_dir, 'icon_{:03d}.png'.format(saved_count))
        icon.save(output_path)
        print("[{}/{}] 保存: {} ({}x{})".format(idx, len(regions), output_path, icon.size[0], icon.size[1]))
    
    print("\n✓ 完成! 发现 {} 个区域，保存了 {} 个唯一图标".format(len(regions), saved_count))
    print("保存目录: {}".format(os.path.abspath(output_dir)))
    
    return saved_count

if __name__ == '__main__':
    import sys
    
    # 默认路径
    input_image = '../public/img/icon/139899.png'
    output_directory = 'output_icons'
    
    # 命令行参数
    if len(sys.argv) > 1:
        input_image = sys.argv[1]
    if len(sys.argv) > 2:
        output_directory = sys.argv[2]
    
    # 检查文件
    if not os.path.exists(input_image):
        print("❌ 错误: 找不到图片文件 '{}'".format(input_image))
        print("\n用法: python split_icons_simple.py [图片路径] [输出目录]")
        sys.exit(1)
    
    print("="*70)
    print(" "*20 + "图标切割工具 v1.0")
    print("="*70)
    print("输入: {}".format(input_image))
    print("输出: {}".format(output_directory))
    print("="*70)
    print()
    
    try:
        split_icons_simple(input_image, output_directory)
    except Exception as e:
        print("\n❌ 错误: {}".format(e))
        import traceback
        traceback.print_exc()
        sys.exit(1)
