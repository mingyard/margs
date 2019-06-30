margs
=====

margs 是一个仿照 xargs 编写的工具,实现了其 -n 和 -P 的功能

-n  声明每次执行X命令最多的参数
-P  声明最多同时运行的X命令数量（并发数）

安装
======

下载[margs](https://github.com/mingyard/margs.git) 到你的电脑。

命令
```
$ git clone https://github.com/mingyard/margs.git
$ npm install . -g

```
例子
======

```
$ ls *.js | margs  -n 3 wc -l
    0 test1.js
    0 test2.js
    0 total
```


```
$ echo {0..8} | xargs -n 2 -P 3 echo 
2 3
0 1
4 5
6 7
8
```
