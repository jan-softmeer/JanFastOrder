// Import all necessary Storefront plugins
import JanFastOrderPlugin from './janfastorder-plugin/janfastorder-plugin.plugin';

// Register your plugin via the existing PluginManager
const PluginManager = window.PluginManager;

PluginManager.register('JanFastOrderPlugin', JanFastOrderPlugin, '[data-janfastorder-plugin]');
