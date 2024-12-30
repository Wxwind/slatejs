import { HtmlTagDescriptor, Plugin } from 'vite';
import dayjs from 'dayjs';

export default function LogInfo(): Plugin {
  const env = process.env;
  env.TZ = 'Asia/Shanghai';
  const __APP_INFO__ = {
    name: env.npm_package_name,
    version: env.npm_package_version,
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  const msg = `
  const styles = [
    'color: blue',
    'font-size: 18px',
    'padding: 5px',
  ].join(';');
  const appInfo= ${JSON.stringify(__APP_INFO__)};
  console.log("%c 名称: ${__APP_INFO__.name}",styles);
  console.log("%c 版本号: ${__APP_INFO__.version}",styles);
  console.log("%c 上次构建时间: ${__APP_INFO__.lastBuildTime}",styles);
  `;
  return {
    name: 'vite-plugin-loginfo',
    apply: 'build',
    transformIndexHtml(): HtmlTagDescriptor[] {
      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: msg,
          injectTo: 'body',
        },
      ];
    },
  };
}
