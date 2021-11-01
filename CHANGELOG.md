## v2.2.1 (2021-11-01)

### Feature
- **Privacy**: 新增隐私说明

## v2.2.0 (2021-10-31)

### Feature
- **Resource**: 新增资源下载功能

### Fix
- **Login**: 修复登录后部分功能仍提示需要登录

## v2.1.0 (2021-10-06)

### Refactor
- **Register**: 注册提示

## v2.0.9 (2021-10-05)

### Refactor
- **API**: 分离接口路径中的版本号

## v2.0.8 (2021-10-05)

### Feature
- **Register**: 增加用户注册功能
- **Bind**: 增加小程序互绑功能

## v2.0.7 (2021-10-04)

### Feature
- **Bind**: 增加小程序用户绑定学生账号功能

## v2.0.6 (2021-10-04)

### Feature
- **Login**: 增加初始登录页面
- **My**: 头部个人信息显示
- **Pages**: 计划页面：注册页面、绑定学校账号页面、忘记密码页面

### Refactor
- **request**: 加入token支持

## v2.0.5 (2021-10-03)

### Refactor
- **Auth**: 使用code授权替换openid
- **SSO**: 重构SSO登录逻辑

## v2.0.4 (2021-10-02)

### Refactor
- **AutoLogin**: 重构自动登录模块，逻辑更清晰

## v2.0.3 (2021-10-01)

### Feature
- **auth**: 新增后端登录授权功能

## v2.0.2 (2021-09-27)

### Fix
- **新闻标签**: 修正左右滑动时标签不跟随的问题
- **code**: 处理了大部分编译时产生的警告

## v2.0.1 (2021-09-26)

### Fix

- **course**: 修复课表第几周显示错误，首页课程安排显示
            
    本次修复后，周几是准确的，但第几周是不一定准确的！

## v2.0.0 (2021-09-20)

### Migration

- **messages**: 从wxapp移植至uniapp

### Refactor

- **request**: 重构网络请求模块


## v1.6.9 (2021-09-20)

### Fix

- **CourseTable**: 修复：课表背景图设置

## v1.6.8 (2021-09-20)

### Refactor

- **News**: 优化：资讯页面体验

## v1.6.7 (2021-09-20)

### Feature

- **Theol**: 新增：教学平台
- **NewStu**: 新增：新生服务
- 
### Refactor

- **CheckIn**: 优化：打卡表单处理
- 
## v1.6.6 (2021-09-20)

### Feature

- **College**: 新增：学院信息

## v1.6.5 (2021-09-20)

### Refactor

- **Card**: 一卡通支付功能，仅保留余额查询功能


## v1.6.3 (2021-09-20)

### Feature

- **Grade**: 新增：平时成绩查看


## v0.1.1 (2020-11-05)


### Fix

- **about**: fix error message not properly showing up its minor component.

## v0.1.0 (2020-08-12)

### Feat

- **about**: add about endpoint with proper version

### Fix

- **messages**: fix error messages in GET api/users/endpoint 
