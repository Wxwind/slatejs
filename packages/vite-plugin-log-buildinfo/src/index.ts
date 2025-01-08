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
    'color: #4adddd',
    'font-size: 16px',
    'padding: 5px',
  ].join(';');
  const appInfo= ${JSON.stringify(__APP_INFO__)};
  console.log("%c App: ${__APP_INFO__.name}",styles);
  console.log("%c Version: ${__APP_INFO__.version}",styles);
  console.log("%c Last Build Time: ${__APP_INFO__.lastBuildTime}",styles);
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
