const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')

// commander的默认操作:
// -h 指令会自动以帮助文档的形式显示已经定义好的command和option
// -V 会显示版本号

function sexFunc(v){
    return '性别是' + v
}

program
    // 定义版本
    // 默认 node exec -V， 改为-v
    .version('0.0.1', '-v, --version')

program
    // 定义option
    // option可以单独定义也可以依附于command定义，如果单独定义则在后面的program中会取到该值

    // 直接指定一个option, 使用 exec -i 或者 exec --init
    .option('-i, --init', '初始化')

    // <>代表必填，第三个参数检查格式的一个函数。使用 exec -n 100
    // 不加100会报错，因为有<>
    .option('-n, --num <n>', '输入一个数字', parseInt)

    // []可填可不填，不填不报错，只是调用的时候会undefined
    .option('-a, --age [age]', '输入你的名字')

    // 第四个参数是默认值
    .option('-s, --sex [sex]', '输入性别', sexFunc, '性别是男')


program
    // 使用： exec run 或 exec run -n 'myname'
    // 参数带了<>, 可以不加参数-n，加了就必须给一个值
    .command('run')
    .alias('r') // 别名
    .description('run一个项目')
    .option('-t, --time <time>', '模块名称') 
    .action(option => {
        console.log('command run done')
        console.log('参数: ', option.time)
    })

program
    // rm 后必须跟一个参数，表明路径，该参数可以通过action的第一个参数直接获得
    .command('rm <dir>')
    .action(function (dir, option) {
        console.log('dir: ', dir)
    })

// 下面是需要动态回答的方法
// type包括： 
// input–输入
// validate–验证
// list–列表选项
// confirm–提示
// checkbox–复选框等等
program
    .command('ask')
    .action(function(){
        inquirer.prompt([
            {
                type: 'input',
                name: 'moduleName',
                message: '请输入模块名称',
                validate: function (input){
                    if(!input) {
                        return '不能为空'
                    }
                    return true
                }
            },{
                type: 'list',
                name: 'css',
                message: '想用什么css预处理器呢',
                choices: [{
                        name: 'Sass/Compass',
                        value: 'sass'
                    },{
                        name: 'Less',
                        value: 'less'
                    }]
            }
        ]).then(function (answers) {
            // chalk给console添加样式
            console.log(chalk.blue(answers.moduleName))
            console.log(chalk.red(answers.css))
        })
    })

program.parse(process.argv)

// 指定定义的option可以在program上直接取到
if(program.age){
    console.log('输入了名字：', program.age)
}


// commander的详细解释见这里：
// https://www.kancloud.cn/outsider/clitool/313192