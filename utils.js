/**
 * 函数名：获取时间差
 * @param {Time} time1  获取时间点1
 * @param {Time} time2   获取时间点2
 * @returns {Object}    以对象方式返回时间差
 */
function getTimeDifference(time1, time2) {
    var difftime = Math.round(Math.abs(time1.getTime() - time2.getTime()) / 1000)
    //换算天
    var day = parseInt(difftime / (60 * 60 * 24))
    //换算小时
    var hour = parseInt(difftime % (60 * 60 * 24) / (60 * 60))
    //换算分钟
    var minutes = parseInt(difftime % (60 * 60) / 60)
    //换算秒
    var seconds = parseInt(difftime % 60)
    return {
        day: day,
        hour: hour,
        minutes: minutes,
        seconds: seconds
    }
}

/**
 * 函数名：获取给值（m，n）范围内的随机整数
 * @param {Number} m 数字1
 * @param {Number} n 数字2
 * @returns {Number} res 返回生成随机数字
 */
function rangeRandom(m, n) {
    var max = Math.max(m, n)
    var min = Math.min(m, n)
    var res = Math.floor(Math.random() * (max - min + 1) + min)
    return res
}

/**
 * 函数名：生成随机rgb颜色值
 * @returns {string}  返回一个rgb颜色
 */
function randomColor() {
    var res = `rgb(${rangeRandom(0,255)} , ${rangeRandom(0,255)} , ${rangeRandom(0,255)} )`
    return res
}

/**
 * 函数名：解析查询字符串
 * @param {string} str 查询字符串
 * @returns 返回解析后的查询字符串
 */
function parseQuerystring(str) {
    var obj = {}
    if (str) {
        var tmp = str.slice(1).split('&')
        tmp.forEach(function (item) {
            var t = item.split('=')
            obj[t[0]] = t[1]
        })
    }
    return obj
}

/**
 * 函数名：获取元素的全部样式
 * @param {Element} ele  要获取样式的元素
 * @param {string} style  要获取的样式字符串
 * @returns  {string}     返回获取到的样式        
 */
function getStyle(ele, style) {
    if ('getComputedStyle' in window) {
        return window.getComputedStyle(ele)[style]
    } else {
        return ele.currentStyle[style]
    }
}

/**
 * 函数名：事件绑定的兼容处理
 * @param {ELEMENT} ele  事件源
 * @param {String} type  事件类型
 * @param {Function} handler 事件处理函数
 * 应用：on(事件源, '事件类型' , 事件处理函数)
 */
function on(ele, type, handler) {
    if (!ele) throw new Error('请按照规则传递正确参数')
    if (ele.nodeType !== 1) throw new Error('请按照规则传递正确参数数值')
    if (ele.addEventListener) {
        ele.addEventListener(type, handler)
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, handler)
    } else {
        ele['on' + type] = handler
    }
}

/**
 * 函数名：事件解绑的兼容处理
 * @param {ELEMENT} ele 事件源
 * @param {String} type 事件类型
 * @param {Function} handler 事件处理函数
 * 应用：off(事件源, '事件类型' , 事件处理函数)
 */
function off(ele, type, handler) {
    if (!ele) throw new Error('请按照规则传递正确参数')
    if (ele.nodeType !== 1) throw new Error('请按照规则传递正确参数数值')

    if (ele.removeEventListener) {
        ele.removeEventListener(type, handler)
    } else if (ele.detachEvent) {
        ele.detachEvent('on' + type, handler)
    } else {
        ele['on' + type] = null
    }
}

/**
 * 函数名：运动函数
 * @param {*} ele 要运动的函数
 * @param {*} target 要运动的样式属性 
 * @param {*} fn  运动结束的回调函数
 */
function move(ele, target, fn = () => {}) {
    // fn 接收的就是你传递进来的那个函数
    let count = 0
    for (let key in target) {
        if (key === 'opacity') target[key] *= 100
        count++
        let timer = setInterval(() => {
            let current = key === 'opacity' ? getStyle(ele, 'opacity') * 100 : parseInt(getStyle(ele, key))
            let distance = (target[key] - current) / 10
            distance = distance > 0 ? Math.ceil(distance) : Math.floor(distance)
            if (current === target[key]) {
                clearInterval(timer)
                count--
                if (!count) {
                    // 把你传递进来的函数执行一下
                    fn()
                }
            } else {
                ele.style[key] = key === 'opacity' ? (current + distance) / 100 : current + distance + 'px'
            }
        }, 30)
    }
}


/**
 * 函数名：设置cookie
 * @param {*} key cookie的键
 * @param {*} value cookie的值
 * @param {*} expires 有效期
 * @param {*} path 存储路径
 */
function setCookie(key, value, expires, path) {
    var str = key + '=' + value
    if (expires) {
        var time = new Date()
        time.setTime(time.getTime() + expires * 1000)
        str += ';expires=' + time
    }
    if (path) {
        str += ';path=' + path
    }
    document.cookie = str
}

/**
 * 函数名：获取cookie
 * @param {STRING} key 要获取的cookie名
 * @returns {STRING} 一个字符串或者对象
 */
function getCookie(key) {
    var tmp = document.cookie.split('; ')
    var o = key ? '' : {}
    tmp.forEach(function (item) {
        var t = item.split('=')
        if (key) {
            if (t[0] === key) {
                o = t[1]
            }
        } else {
            o[t[0]] = t[1]
        }
    })
    return o
}

/**
 * 函数名：创建ajax对象
 * @returns {Object}  当前浏览器使用的ajax对象
 */
function creXhr() {
    var xhr = null
    var flag = false
    var arr = [
        function () {
            return new XMLHttpRequest()
        },
        function () {
            return new ActiveXObject('Microsoft.XMLHTTP')
        },
        function () {
            return new ActiveXObject('Msxml.XMLHTTP')
        },
        function () {
            return new ActiveXObject('Msxml2.XMLHTTP')
        }
    ]
    for (let i = 0; i < arr.length; i++) {
        try {
            xhr = arr[i]()
            creXhr = arr[i]
            flag = true
            break
        } catch (e) {}
    }
    if (!flag) {
        xhr = '您的浏览器不支持 ajax, 请更换浏览器重试'
        throw new Error(xhr)
    }
    return xhr
}


/**
 * ajax 发送 ajax 请求的方法
 * @param { OBJECT } options 请求的所有配置项
 */
function ajax(options = {}) {
    if (!options.url) {
        throw new Error('url 为必填选项')
    }
    if (!(options.type == undefined || options.type.toUpperCase() === 'GET' || options.type.toUpperCase() === 'POST')) {
        throw new Error('目前只接收 GET 或者 POST 请求方式, 请期待更新')
    }
    if (!(options.async == undefined || typeof options.async === 'boolean')) {
        throw new Error('async 需要一个 Boolean 数据类型')
    }
    if (!(options.dataType == undefined || options.dataType === 'string' || options.dataType === 'json')) {
        throw new Error('目前只支持 string 和 json 格式解析, 请期待更新')
    }
    if (!(options.data == undefined || typeof options.data === 'string' || Object.prototype.toString.call(options.data) === '[object Object]')) {
        throw new Error('data 参数只支持 string 和 object 数据类型')
    }
    if (!(options.success == undefined || typeof options.success === 'function')) {
        throw new Error('success 传递一个函数类型')
    }
    if (!(options.error == undefined || typeof options.error === 'function')) {
        throw new Error('error 传递一个函数类型')
    }

    // 2. 设置一套默认值
    var _default = {
        url: options.url,
        type: options.type || 'GET',
        async: typeof options.async === 'boolean' ? options.async : true,
        dataType: options.dataType || 'string',
        data: options.data || '',
        success: options.success || function () {},
        error: options.error || function () {}
    }
    if (typeof _default.data === 'object') {
        var str = ''
        for (var key in _default.data) {
            str += key + '=' + _default.data[key] + '&'
        }
        _default.data = str.slice(0, -1)
    }

    // 3. 发送请求
    var xhr = creXhr()
    if (_default.type.toUpperCase() === 'GET' && _default.data) {
        _default.url += '?' + _default.data
    }
    xhr.open(_default.type, _default.url, _default.async)
    xhr.onreadystatechange = function () {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
            if (_default.dataType === 'json') {
                var res = JSON.parse(xhr.responseText)
                _default.success(res)
            } else if (_default.dataType === 'string') {
                _default.success(xhr.responseText)
            }
        }
        if (xhr.readyState === 4 && xhr.status >= 400) {
            _default.error(xhr.status)
        }
    }
    if (_default.type.toUpperCase() === 'POST') {
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    }
    xhr.send(_default.data)
}

/**
 * 函数名：以promise函数的形式发送ajax请求
 * @param {OBJECT} options 
 * @returns 一个promise函数
 */
function pAjax(options){
        return new Promise(function(resolve,reject){
            ajax({
                url: options.url,
                data: options.data,
                async: options.async,
                dataType: options.dataType,
                type: options.type,
                success(res){
                    resolve(res)
                },
                error(err){
                    reject(err)
                }
            })
        })
}