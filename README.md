# 自動搜尋電話號碼(Whoscall)
因為現在網頁版的whoscall，因有機器人擋住自動搜尋，所以我們改使用手機來達到一樣的效果。

### 這邊主要分成兩個部份
### 一個是用戶端
1. 安裝所需要的套件
```bash 
$ pip install Appium-Python-Client
$ pip install pytest
$ cd code/

# 開始程式
$ electron . 
```

![](https://i.imgur.com/M3TMHqK.png)




### 一個是服務器端
#### Appium Desktop apps

[Click](https://github.com/appium/appium-desktop)

#### Appium
[Click](http://appium.io/)



### ADB Usage
```
$ adb kill-server

$ adb start-server
```