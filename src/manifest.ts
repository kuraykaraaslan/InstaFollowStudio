import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/icon-16.png',
    32: 'img/icon-32.png',
    48: 'img/icon-48.png',
    128: 'img/icon-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/icon-48.png',
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://instagram.com/*', 'https://instagram.com/*'],
      js: ['src/contentScript/index.tsx'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: ['img/icon-16.png', 'img/icon-32.png', 'img/icon-48.png', 'img/icon-128.png'],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage', 'activeTab', 'scripting', 'tabs', 'webNavigation'],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
})