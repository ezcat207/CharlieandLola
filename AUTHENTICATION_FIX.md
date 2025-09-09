# 🔧 Google Sign-In FedCM 错误修复指南

## 🚨 诊断结果
错误：`[GSI_LOGGER]: FedCM get() rejects with NetworkError: Error retrieving a token.`

### 根本原因：
1. **AUTH_URL 双斜杠错误**: `http://charlielola.com//api/auth`
2. **HTTP vs HTTPS**: Google OAuth 要求 HTTPS
3. **FedCM 配置不完整**: Google One Tap 需要额外域名验证

## ✅ 立即修复步骤

### 1. 修复环境变量 (.env.production)

```bash
# 修复前（错误）:
AUTH_URL = "http://charlielola.com//api/auth"
NEXT_PUBLIC_WEB_URL = "http://charlielola.com"

# 修复后（正确）:
AUTH_URL = "https://charlielola.com/api/auth"
NEXT_PUBLIC_WEB_URL = "https://charlielola.com"
```

### 2. Google OAuth 控制台配置

访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

**已授权的重定向 URI:**
```
https://charlielola.com/api/auth/callback/google
```

**已授权的 JavaScript 源:**
```
https://charlielola.com
```

### 3. 添加域名验证文件

创建 `public/.well-known/web-identity` 文件：
```json
{
  "provider_urls": ["https://accounts.google.com"],
  "assertion_endpoint": "/api/auth/callback/google-one-tap"
}
```

### 4. 修复 NextAuth.js 配置

更新 `src/auth/config.ts`：

```typescript
// 添加域名配置
export const authOptions: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  // 添加这些配置
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    // ... 现有的 callbacks
    async redirect({ url, baseUrl }) {
      // 确保使用 HTTPS
      const secureBaseUrl = baseUrl.replace(/^http:/, 'https:');
      if (url.startsWith("/")) return `${secureBaseUrl}${url}`;
      else if (new URL(url).origin === secureBaseUrl) return url;
      return secureBaseUrl;
    },
  },
};
```

## 🔍 验证步骤

### 1. 检查环境变量
```bash
# 确认以下变量正确设置：
AUTH_SECRET=你的密钥
AUTH_URL=https://charlielola.com/api/auth
NEXT_PUBLIC_WEB_URL=https://charlielola.com
AUTH_GOOGLE_ID=你的Google客户端ID
AUTH_GOOGLE_SECRET=你的Google客户端密钥
```

### 2. 测试认证流程
1. 访问 `https://charlielola.com/auth/signin`
2. 点击 Google 登录
3. 检查浏览器开发者工具是否还有 FedCM 错误

### 3. 验证 Google One Tap
1. 清除浏览器缓存和 cookies
2. 访问主页
3. 检查是否显示 Google One Tap 提示

## 🚀 生产环境部署检查清单

- [ ] 域名使用 HTTPS
- [ ] AUTH_URL 无双斜杠
- [ ] Google OAuth 控制台配置正确的回调 URL
- [ ] 添加域名验证文件
- [ ] 清除浏览器缓存测试
- [ ] 检查控制台无 FedCM 错误

## 🔧 故障排查

如果仍有问题，检查：

1. **网络检查**: 访问 `https://charlielola.com/api/auth/providers`
2. **控制台检查**: 浏览器开发者工具 → Network 标签
3. **域名检查**: 确认域名可以通过 HTTPS 访问
4. **OAuth 检查**: 验证 Google Cloud Console 配置

## 💡 预防措施

1. **环境变量验证**: 部署前检查所有 AUTH_ 变量
2. **HTTPS 强制**: 生产环境始终使用 HTTPS
3. **定期测试**: 定期测试认证流程
4. **监控错误**: 设置错误监控捕获认证问题

---
*修复完成后，FedCM 错误应该消失，Google 登录功能正常工作。*