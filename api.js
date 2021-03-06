/*global require, module */
var cpPromise = require('./child-process-promise'),
	API = require('claudia-api-builder'),
	api = new API(),
	fs = require('fs'),
	path = require('path'),
	setUpHandler = function (url, command, paramsGenerator) {
		api.get(url, function (request) {
			'use strict';
			return cpPromise.spawn(command, paramsGenerator(request));
		}, {success: { contentType: 'text/plain'}});
	};

setUpHandler('/ldconfig', '/sbin/ldconfig', () => ['-p']);
setUpHandler('/packages', '/usr/bin/yum', () => ['list', 'installed']);
setUpHandler('/pkg-config', '/usr/bin/pkg-config', () => ['--list-all']);
setUpHandler('/pkg-config/{package}/{command}', '/usr/bin/pkg-config', (request) => ['--' + request.pathParams.command, request.pathParams.package]);
setUpHandler('/env', '/bin/env', () => []);
api.get('/', request => '/' + request.context.stage + '/index', {success: 302});
api.get('/index', () => fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'), {success: {contentType: 'text/html'}});

module.exports = api;
