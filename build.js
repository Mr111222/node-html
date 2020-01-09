var fs = require('fs')
var path = require('path')
var sass = require('node-sass')
var UglifyJS = require("uglify-js")


// var cssFiles = {
//   'css/c_oct.scss': 'c_oct.css',
//   'slider/c_oct_slider_form.scss': 'c_oct_slider_form.css'
// }
var jsFiles = {
  'main.js': 'main.js'
}
// for (var cfs in cssFiles) {
//   console.log('开始编译' + cfs)
//   var cssInFileName = path.resolve(cfs)
//   var cssOutFileName = path.resolve('./dist', cssFiles[cfs])
//   sass.render({
//     file: cssInFileName,
//     outFile: cssOutFileName,
//     outputStyle: 'compressed',
//     sourceMap: false
//   }, function (err, result) {
//     if (err) {
//       console.log(cfs + '编译出错', err)
//     } else {
//       fs.writeFile(cssOutFileName, result.css, function (err) {
//         if (err) {
//           console.log(cfs + '保存出错', err)
//         } else {
//           console.log(cfs + '编译成功')
//         }
//       })
//     }
//   })
// }

for (var jfs in jsFiles) {
  console.log('开始编译' + jfs)
  var jsInFileName = path.resolve(jfs)
  var jsOutFileName = path.resolve('./dist', jsFiles[jfs])
  var jsInFileCode = fs.readFileSync(jsInFileName,'utf-8')
  var result = UglifyJS.minify(jsInFileCode, {
    mangle: true,
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_debugger: true,
      drop_console: true,
      global_defs: {
        /*
        日志等级，0~3分别代表debug,log,warn,error
        如指定为3，将只打印error类型的日志(通过console.error实现)，忽略其他日志
        */
        "@logLv": "1"
      }
    },
    output: {
      comments: /\-+.+开始\-+/
    }
  })

  if (result.error) {
    console.log(jfs + '编译出错', result.error)
  } else if (result.code) {
    fs.writeFile(jsOutFileName, result.code, function (err) {
      if (err) {
        console.log(jfs + '保存出错', err)
      } else {
        console.log(jfs + '编译成功')
      }
    })
  }
}
