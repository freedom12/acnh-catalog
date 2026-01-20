/**
 * 图片工具函数
 */

/**
 * CDN 主机地址
 */
export const CDN_HOST = 'https://nh-cdn.catalogue.ac/';

/**
 * 处理图片 URL，如果不是完整 URL 则添加 CDN 前缀
 * @param imageUrl 图片 URL
 * @returns 处理后的完整 URL
 */
export function processImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';

  let url = imageUrl;
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    url = CDN_HOST + imageUrl;
  }

  if (
    !url.endsWith('.png') &&
    !url.endsWith('.jpg') &&
    !url.endsWith('.jpeg') &&
    !url.endsWith('.gif')
  ) {
    url += '.png';
  }
  return url;
}
