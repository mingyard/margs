#!/usr/bin/env node
const exec = require('child_process').exec
const startTime = new Date().getTime()
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
    let chunk;
    const args = new Margs();
    while (chunk = process.stdin.read()) {
        const getDateTime = new Date().getTime()
        //用时间差来判断，是否是后续输入(有些投机取巧，但是这是唯一能想到。区分出来是否是后续输入的方法。在读取超大文件的时候，可能会存在问题。)
        // console.log(getDateTime - startTime)
        if (getDateTime - startTime > 200) {
            continue;
        }
        args.todo(chunk)
    }
});
process.stdin.on('end', () => {
    // process.stdout.write('结束\n');
});

class Margs {
    constructor(n = 0, p = 1) {
        this.n = n
        this.p = p
        this.cmd = []
        this.init()
    }
    //初始化命令参数
    init() {
        const cmdArr = process.argv.slice(2)
        //初始默认无参数
        this.cmd = cmdArr.slice(0)
        for (let i in cmdArr) {
            //设置-n参数
            if (!this.n && /^-n/.test(cmdArr[i])) {
                //n紧跟数字
                if (cmdArr[i].length != 2 && +cmdArr[i].split('-n')[1] > 0) {
                    this.n = +cmdArr[i].split('-n')[1]
                    this.cmd = cmdArr.slice(+i + 1)
                } else if (cmdArr[i].length == 2 && +cmdArr[+i + 1] > 0) {
                    this.n = +cmdArr[+i + 1]
                    this.cmd = cmdArr.slice(+i + 2)
                } else {
                    process.stdout.write("margs: illegal argument count")
                    break;
                }
            }
            //设置-p参数
            else if (this.p == 1 && /^-P/.test(cmdArr[i])) {
                //p紧跟数字
                if (cmdArr[i].length != 2 && +cmdArr[i].split('-P')[1] > 0) {
                    this.p = +cmdArr[i].split('-P')[1]
                    this.cmd = cmdArr.slice(+i + 1)
                } else if (cmdArr[i].length == 2 && +cmdArr[+i + 1] > 0) {
                    this.p = +cmdArr[+i + 1]
                    this.cmd = cmdArr.slice(+i + 2)
                } else {
                    process.stdout.write("margs: illegal argument count")
                    break;
                }
            }
        }
        //初始化参数结果
        // console.log(this.n,this.p,this.cmd)
    }

    //执行命令
    todo(chunk) {
        const doArray = chunk.replace(/\n/g, ' ').split(" ")
        //删除最后一个空值
        doArray.pop()
        let execArray = []
        let n = this.n ? this.n : doArray.length
        //参数分组
        for (let i = 0; i < doArray.length; i += n) {
            execArray.push(doArray.slice(i, i + n))
        }
        const times = this.p
        //多线程执行
        for (let i = 0; i < times; i++) {
            this.consume(execArray)
        }
    }
    async consume(doArray) {
        if (this.p - 1 >= 0 && doArray.length != 0) {
            try {
                this.p--
                let stdout = await this.exec(doArray.shift())
                process.stdout.write(stdout)
                this.p++
                this.consume(doArray)
            } catch (error) {
                process.stdout.write(error)
            }
        }
    }
    exec(arr) {
        return new Promise((resolve, reject) => {
            exec(this.cmd.join(" ") + ' ' + arr.join(" "), function callback(error, stdout, stderr) {
                if (error) {
                    return reject(error)
                }
                resolve(stdout)
            })
        })
    }
}

