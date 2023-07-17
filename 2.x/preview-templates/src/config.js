let previewKey = {
    nodeColorKey: "_$_preview_node_color",
    cameraColorKey: "_$_preview_camera_color",
}
let config = {
    previewKey: previewKey,
    compTemplate: {
        "Node": {
            values: [
                {
                    name: 'Position',
                    values: [
                        { name: 'X', key: "x", type: 'number' },
                        { name: 'Y', key: "y", type: 'number' },
                    ],
                    type: 'value'
                },
                {
                    name: 'Rotation',
                    values: [
                        { name: "", key: "angle", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: 'Scale',
                    values: [
                        { name: 'X', key: "scaleX", type: 'number' },
                        { name: 'Y', key: "scaleY", type: 'number' },
                    ],
                    type: 'value'
                },
                {
                    name: 'Anchor',
                    values: [
                        { name: 'X', key: "anchorX", type: 'number' },
                        { name: 'Y', key: "anchorY", type: 'number' },
                    ],
                    type: 'value'
                },
                {
                    name: 'Size',
                    values: [
                        { name: 'W', key: "width", type: 'number' },
                        { name: 'H', key: "height", type: 'number' },
                    ],
                    type: 'value'
                },
                {
                    name: 'Color',
                    values: [
                        { name: "", key: previewKey.nodeColorKey, type: 'text' }
                    ],
                    type: "color"
                },
                {
                    name: 'Opacity',
                    values: [
                        { name: '', key: "opacity", type: 'number' },
                    ],
                    type: 'value'
                },
                {
                    name: 'Group',
                    values: [
                        { name: '', key: "group", type: 'text' },
                    ],
                    type: 'list',
                    list: () => { return cc.game.groupList }
                }
            ]
        },
        "Widget": {
            values: [
                {
                    name: "Top",
                    values: [
                        { name: "", key: "top", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: "Left",
                    values: [
                        { name: "", key: "left", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: "Right",
                    values: [
                        { name: "", key: "right", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: "Bottom",
                    values: [
                        { name: "", key: "bottom", type: 'number' }
                    ],
                    type: 'value'
                },
            ]
        },
        "Label": {
            values: [
                {
                    name: "String",
                    values: [
                        { name: "", key: "string", type: 'text' }
                    ],
                    type: 'value'
                },
                {
                    name: "FontSize",
                    values: [
                        { name: "", key: "fontSize", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: "LineHeight",
                    values: [
                        { name: "", key: "lineHeight", type: 'number' }
                    ],
                    type: 'value'
                },
            ]
        },
        "RichText": {
            values: [
                {
                    name: "String",
                    values: [
                        { name: "", key: "string", type: 'text' }
                    ],
                    type: 'value'
                },
                {
                    name: "FontSize",
                    values: [
                        { name: "", key: "fontSize", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: "LineHeight",
                    values: [
                        { name: "", key: "lineHeight", type: 'number' }
                    ],
                    type: 'value'
                },
            ]
        },
        "Camera": {
            values: [
                {
                    name: "Depth",
                    values: [
                        { name: "", key: "depth", type: 'number' }
                    ],
                    type: 'value'
                },
                {
                    name: 'Background Color',
                    values: [
                        { name: "", key: previewKey.cameraColorKey, type: 'text' }
                    ],
                    type: "color"
                },
            ]
        }
    }
}

let getCache = function () {
    let rawCacheData = cc.assetManager.assets._map;
    let cacheData = [];
    let totalTextureSize = 0;
    for (let k in rawCacheData) {
        let item = rawCacheData[k];
        if (item.type !== 'js' && item.type !== 'json') {
            let itemName = '_';
            let preview = '';
            let content = item.__classname__;
            let formatSize = 0;
            if (item.type === 'png' || item.type === 'jpg') {
                let texture = rawCacheData[k.replace('.' + item.type, '.json')];
                if (texture && texture._owner && texture._owner._name) {
                    itemName = texture._owner._name;
                    preview = texture.content.url;
                }
            } else {
                if (item._name) {
                    itemName = item._name;
                } else if (item._owner) {
                    itemName = (item._owner && item._owner.name) || '_';
                }
                if (content === 'cc.Texture2D') {
                    preview = item.nativeUrl;
                    let textureSize = item.width * item.height * ((item._native === '.jpg' ? 3 : 4) / 1024 / 1024);
                    totalTextureSize += textureSize;
                    // sizeStr = textureSize.toFixed(3) + 'M';
                    formatSize = Math.round(textureSize * 1000) / 1000;
                } else if (content === 'cc.SpriteFrame') {
                    preview = item._texture.nativeUrl;
                }
            }
            cacheData.push({
                queueId: item.queueId,
                type: content,
                name: itemName,
                preview: preview,
                id: item._uuid,
                size: formatSize
            });
        }
    }
    let cacheTitle = `[文件总数:${cacheData.length}][纹理缓存:${totalTextureSize.toFixed(2) + 'M'}]`;
    return [cacheData, cacheTitle];
}
config.getCache = getCache;

window.preview_config = config