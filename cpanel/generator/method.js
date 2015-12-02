if (Meteor.server) {
    var fs = Npm.require('fs');
    var path = Npm.require('path');
    var basePath = path.resolve('.').split('.meteor')[0];

    var tmplPath = path.join(basePath, 'cpanel', 'generator', 'private');
    var tmplFile = {
        module: path.join(tmplPath, 'module.txt'),
        namespace: path.join(tmplPath, 'namespace.txt'),
        security: path.join(tmplPath, 'security.txt'),
        group_router: path.join(tmplPath, 'group_router.txt'),
        home_router: path.join(tmplPath, 'home_router.txt'),
        navbar: path.join(tmplPath, 'navbar.txt'),
        navbar_right: path.join(tmplPath, 'navbar_right.txt'),
        home_tmpl: path.join(tmplPath, 'home_tmpl.txt'),
    };

    Meteor.methods({
        cpanel_generatorModule: function (moduleName) {
            check(moduleName, String);

            let _path = _modulePath(moduleName);
            _moduleMake(_path);

            return 'success';
        }
    });

    // Make module
    var _moduleMake = function (structure) {
        let _tmplPath;
        _.forEach(structure, function (val, key) {
            if (key != 'writeFiles') {
                if (_.isObject(val)) {
                    _moduleMake(val);
                } else {
                    fs.exists(val, function (exists) {
                        if (!exists) {
                            mkdirp(val, function (err) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    fs.writeFileSync(path.join(val, '.gitkeep'), '', 'utf8');

                                    console.log('mkdir: ' + val);
                                }
                            });
                        }
                    });
                }
            } else { // write file
                _.forEach(val, function (fileAtr) {
                    let fileName = fileAtr.name + '.' + fileAtr.ext;
                    let pathAndFileName = path.join(_tmplPath, fileName);
                    let contentFile = fs.readFileSync(tmplFile[fileAtr.tmpl], 'utf8');

                    // Replace template
                    contentFile = contentFile.allReplace(fileAtr.replace);

                    // Write file
                    fs.exists(_tmplPath, function (exists) {
                        if (exists) {
                            fs.writeFileSync(pathAndFileName, contentFile, 'utf8');
                            console.log('Folder exists: ');
                            console.log(_tmplPath);

                        } else {
                            console.log('Folder not exists: ');
                            console.log(_tmplPath);

                            mkdirp(_tmplPath, function (err) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    fs.writeFileSync(pathAndFileName, contentFile, 'utf8');
                                }
                            });
                        }
                    });

                    console.log('mkfile: ' + pathAndFileName);
                });
            }

            _tmplPath = val;
        })
    };

    // Create module path
    var _modulePath = function (moduleName) {
        let moduleCamel = _.camelCase(moduleName);
        let moduleCapital = _.capitalize(moduleCamel);
        let modulePath = path.join(basePath, moduleCamel);

        let _path = {
            module: modulePath,
            common: {
                path: path.join(modulePath, 'common'),
                collections: {
                    path: path.join(modulePath, 'common', 'collections'),
                    reports: path.join(modulePath, 'common', 'collections', 'reports'),
                },
                collectionsHelper: path.join(modulePath, 'common', 'collections_helper'),
                lib: {
                    path: path.join(modulePath, 'common', 'lib'),
                    cinfig: {
                        path: path.join(modulePath, 'common', 'lib', 'config'),
                        writeFiles: [
                            {
                                name: 'module',
                                ext: 'js',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'module'
                            },
                            {
                                name: 'namespace',
                                ext: 'js',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'namespace'
                            },
                        ]
                    }
                },
                tabulars: path.join(modulePath, 'common', 'tabulars')
            },
            server: {
                path: path.join(modulePath, 'server'),
                app: {
                    path: path.join(modulePath, 'server', 'app'),
                    writeFiles: [
                        {
                            name: 'security',
                            ext: 'js',
                            replace: {
                                '{{MODULE_NAME_CAM}}': moduleCamel,
                                '{{MODULE_NAME_CAP}}': moduleCapital
                            },
                            tmpl: 'security'
                        },
                    ]
                },
                collectionsCache: path.join(modulePath, 'server', 'collections_cache'),
                collectionsHook: path.join(modulePath, 'server', 'collections_hook'),
                fixtures: path.join(modulePath, 'server', 'fixtures'),
                methods: path.join(modulePath, 'server', 'methods'),
                publications: path.join(modulePath, 'server', 'publications'),
                routers: path.join(modulePath, 'server', 'routers'),
                security: path.join(modulePath, 'server', 'security'),
                startup: path.join(modulePath, 'server', 'startup'),
            },
            client: {
                path: path.join(modulePath, 'client'),
                app: {
                    path: path.join(modulePath, 'client', 'app'),
                    compatibility: path.join(modulePath, 'client', 'app', 'compatibility'),
                    config: path.join(modulePath, 'client', 'app', 'config'),
                    helpers: path.join(modulePath, 'client', 'app', 'helpers'),
                    libraries: path.join(modulePath, 'client', 'app', 'libraries'),
                    lists: path.join(modulePath, 'client', 'app', 'lists'),
                    startup: path.join(modulePath, 'client', 'app', 'startup'),
                },
                css: path.join(modulePath, 'client', 'css'),
                routers: {
                    path: path.join(modulePath, 'client', 'routers'),
                    writeFiles: [
                        {
                            name: 'home',
                            ext: 'js',
                            replace: {
                                '{{MODULE_NAME_CAM}}': moduleCamel,
                                '{{MODULE_NAME_CAP}}': moduleCapital
                            },
                            tmpl: 'home_router'
                        },
                    ],
                    reports: {
                        path: path.join(modulePath, 'client', 'routers', 'reports'),
                        writeFiles: [
                            {
                                name: '_group',
                                ext: 'js',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'group_router'
                            },
                        ]
                    }
                },
                templates: {
                    path: path.join(modulePath, 'client', 'templates'),
                    _layout: {
                        path: path.join(modulePath, 'client', 'templates', '_layout'),
                        writeFiles: [
                            {
                                name: 'navbar',
                                ext: 'html',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'navbar'
                            },
                            {
                                name: 'navbar_right',
                                ext: 'html',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'navbar_right'
                            },
                        ],
                    },
                    _reports: path.join(modulePath, 'client', 'templates', '_reports'),
                    _help: path.join(modulePath, 'client', 'templates', '_help'),
                    home: {
                        path: path.join(modulePath, 'client', 'templates', 'home'),
                        writeFiles: [
                            {
                                name: 'home',
                                ext: 'html',
                                replace: {
                                    '{{MODULE_NAME_CAM}}': moduleCamel,
                                    '{{MODULE_NAME_CAP}}': moduleCapital
                                },
                                tmpl: 'home_tmpl'
                            },
                        ],
                    },
                }
            }
        };

        return _path;
    };

    // All replace string
    String.prototype.allReplace = function (obj) {
        let retStr = this;
        for (let x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }

        return retStr;
    };
}
