# 背单词 App

一个精美的 React Native 背单词应用，采用现代化的 UI 设计，支持单词学习、进度追踪和卡片翻转动画。

## 功能特性

- 🎯 **单词学习** - 通过卡片翻转的方式学习单词
- 📊 **进度追踪** - 记录已掌握的单词和复习次数
- 📚 **分类学习** - 按照不同分类组织单词
- ✨ **精美界面** - 现代化的渐变色设计
- 💾 **本地存储** - 使用 AsyncStorage 保存学习进度

## 技术栈

- React Native 0.83.1
- React Navigation
- React Native Reanimated (动画)
- React Native Linear Gradient (渐变)
- AsyncStorage (数据持久化)
- TypeScript

## 安装依赖

```bash
cd EnglishWordApp
npm install
```

## 安卓真机调试

### 前置要求

1. **启用开发者选项**
   - 在手机上进入"设置" > "关于手机"
   - 连续点击"版本号"7次，启用开发者模式
   - 返回"设置"，找到"开发者选项"

2. **开启USB调试**
   - 进入"开发者选项"
   - 开启"USB调试"开关

3. **连接设备**
   - 使用 USB 数据线连接电脑和手机
   - 手机上会弹出授权窗口，点击"允许"

### 验证连接

运行以下命令检查设备是否连接成功：

```bash
adb devices
```

如果看到设备列表，说明连接成功。

### 运行应用

1. **启动 Metro 服务器**
```bash
npm start
```

2. **在另一个终端运行安卓应用**
```bash
npm run android
```

3. **首次运行可能需要较长时间**，因为需要下载 Gradle 依赖并构建应用

### 常见问题

**问题1：设备未识别**
- 检查 USB 数据线是否支持数据传输
- 尝试更换 USB 端口
- 在手机上重新授权 USB 调试

**问题2：构建失败**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**问题3：应用闪退**
```bash
adb logcat
```
查看日志定位问题

**问题4：红屏错误**
- 在终端按 'd' 打开开发者菜单
- 选择"Reload"重新加载

### WiFi 调试

如果想通过 WiFi 调试：

1. 确保手机和电脑在同一 WiFi 网络
2. 手机连接 USB 后运行：
```bash
adb tcpip 5555
adb connect <手机IP>:5555
```
3. 现在可以断开 USB 数据线，通过 WiFi 调试

## 项目结构

```
EnglishWordApp/
├── android/                 # Android 原生代码
├── ios/                   # iOS 原生代码
├── src/
│   ├── data/             # 示例数据
│   ├── hooks/            # 自定义 Hooks
│   ├── navigation/       # 导航配置
│   ├── screens/          # 页面组件
│   └── types/            # TypeScript 类型定义
├── App.tsx               # 应用入口
└── package.json
```

## 开发说明

### 添加新单词

编辑 `src/data/words.ts` 文件：

```typescript
{
  id: 'new-id',
  word: 'example',
  pronunciation: '/ɪɡˈzæmpəl/',
  meaning: '例子',
  example: 'This is an example.',
  category: 'daily',
  mastered: false,
  reviewCount: 0,
}
```

### 自定义样式

所有样式都在各个 Screen 文件的 `StyleSheet` 中定义，可以根据需要调整颜色和布局。
