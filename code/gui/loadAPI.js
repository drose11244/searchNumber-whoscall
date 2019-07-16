var { PythonShell } = require('python-shell')
var spawn = require('child_process').spawn
var exec = require("child_process").exec;
var path = require("path")
var $ = require('jquery')
var fs = require('fs')
var sweetalert = require('sweetalert')

var length;
var status;
var amount;

function processBarLength(barLength) {
    $('#progressID').width(barLength);
}

function processBarStatus(barStatus) {
    $('#progressID').html(barStatus);
}

function errorStatus(status) {
    sweetAlert("哎呦...", status, "error");
    status = "";
    length = "0%";
    processBarStatus(status);
    processBarLength(length);
    $("#uploadFileID").attr("disabled", false);
    $('#uploadFileID').replaceWith('<input id="uploadFileID" type="file" id="input" onchange="handleFiles(this.files)">');
}


function appium(filePath) {

    try {

        let options = {
            scriptPath: path.join(__dirname, '/../python/'),
            args: filePath
        }

        let pyshell = new PythonShell('android_real_devices.py', options);

        pyshell.on('message', function (message) {

            let getDataIndexOf = message.indexOf("_");
            let getDataType = message.substring(0, getDataIndexOf);

            // console.log("------------")
            // console.log(message)
            // console.log("------------")

            switch (getDataType) {
                case "init":
                    console.log("init");
                    // let status = message.slice(5);
                    status = "程式初始完成，準備開始搜尋，請稍後..."
                    length = "2%";
                    processBarStatus(status);
                    processBarLength(length);
                    break;

                case "width":
                    console.log("width");
                    length = message.slice(6);
                    console.log(length);
                    processBarLength(length)

                    break;
                case "amount":
                    console.log("amount");
                    amount = message.slice(7);
                    console.log(amount);
                    processBarStatus(amount)
                    break;
                case "done":
                    console.log("done");
                    swal({
                        title: "恭喜！！！",
                        text: "檔案已搜尋完畢。",
                        icon: "success",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((info) => {
                            if (info) {
                                // Success
                                $("#uploadFileID").attr("disabled", false);
                                // let download = path.join(__dirname + "../../done/")
                                // exec('explorer.exe /select,"E:\\Workspace\\Java"')
                                // exec('xdg-open ' + download)
                                window.location.reload()
                                console.log("success")

                            } else {
                                // Error
                                console.log("cancel")
                            }
                        });
                    break;
                case "error":
                    console.log("error");
                    error = message.slice(6);

                    if (error == "init") {
                        error = "程式初始化有問題。"
                    }

                    if (error == "file") {
                        error = "尋找檔案時發生錯誤。"
                    }

                    if (error == "device") {
                        error = "裝置或伺服器有問題。"
                    }

                    errorStatus(error)
                    break;

                case "test":
                    // console.log("test");
                    console.log(message);
                    break;

                default:
                    console.log("error format - switch")
                    // sweetAlert("哎呦...", "出錯", "error");
                    status = "格式出現錯誤"
                    errorStatus(status)
                    break;
            }
        })


        pyshell.end(function (err) {
            if (err) {
                console.log(err);
            }
            console.log("close APP.")
        });



    } catch (error) {
        status = "裝置有問題"
        errorStatus(status)
    }

}


function makeFileRadom(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function handleFiles(file) {

    // console.log(file)
    // console.log(file[0].path)
    // console.log("now")
    // console.log(__dirname)


    $("#uploadFileID").attr("disabled", '');
    let current = path.join(__dirname, '../tmp/')
    let fileName = makeFileRadom(15) + file[0].name;
    let fileuploadPath = file[0].path;
    let filestorePath = current + fileName;

    try {
        fs.copyFile(fileuploadPath, filestorePath, (err) => {
            if (!err) {
                console.log('Success');
                status = "檔案上傳成功...，程式初始化中..."
                length = "1%";
                processBarStatus(status);
                processBarLength(length);
                appium(filestorePath);
                return 0;
            }
            errorStatus("檔案上傳有問題(01)")
        });

    } catch (error) {
        errorStatus("檔案上傳有問題(02)")
    }





}


function stopProgram() {
    swal({
        title: "注意！！！",
        text: "確定要中止程式?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                // Success
                // errorStatus("程式已中止")
                // $("#uploadFileID").attr("disabled", false);
                window.location.reload()
            } else {
                // Error
                console.log("cancel")
            }
        });
}


function restartUploadFile() {
    swal({
        title: "注意！！！",
        text: "確定檔案要重新上傳？",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                // Success
                // $("#uploadFileID").attr("disabled", false);
                window.location.reload()
            } else {
                // Error
                console.log("cancel")
            }
        });
}


function openfolder() {


    // exec('explorer.exe /select,"E:\\Workspace\\Java"')
    let download = path.join(__dirname + "../../done/")
    // let download = __dirname
    // console.log("open " + download)
    // exec('xdg-open ../../../../done/')

    var open = spawn('xdg-open', [download]);

    open.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    open.on('error', function (code) {
        console.log('error with code ' + code);
    });

    open.on('close', function (code) {
        console.log('closed with code ' + code);
    });

    open.on('exit', function (code) {
        console.log('exited with code ' + code);
    });

}

function clearTmp() {
    // exec('explorer.exe /select,"E:\\Workspace\\Java"')
    let tmpPath = path.join(__dirname + "../../tmp/")
    tmpPath = tmpPath + "*"
    // console.log(tmpPath)

    let child = exec("rm -rf " + tmpPath, function (err, stdout, stderr) {
        // Handle result
        if (err) {
            console.log("err")
            console.log(err)
            return 1;
        }

        if (stdout) {
            console.log("stdout")
            console.log(stdout)
            return 0;
        }

        if (stderr) {
            console.log("stderr")
            console.log(stderr)
            return 1;
        }
        console.log("done")

    });

}
