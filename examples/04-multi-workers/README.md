# 04-multi-workers: Bundle Size Optimized Splitting Example

このサンプルは、**hono-builder**の差別化ポイントである「**バンドルサイズ優先の分割**」を実証します。

## 🎯 概要

従来のマイクロサービスアーキテクチャでは、機能単位でサービスを分割しますが、hono-builderでは**バンドルサイズを優先**して分割を行います。これにより、各Workersのバンドルサイズを最適化し、冷間スタート時間を短縮できます。

## 📊 バンドルサイズ比較

| エントリーポイント | 含まれるルート | バンドルサイズ | 用途 |
|---|---|---|---|
| `dev` | r1-r9 (全て) | **29K** | 開発環境・フルアプリケーション |
| `entry1` | r1-r3 | **25K** | 軽量操作用 |
| `entry2` | r4-r6 | **25K** | 中程度操作用 |
| `entry3` | r7-r9 | **25K** | 重量操作用 |

> **重要**: 分割されたエントリーは、全体のバンドルより小さくなります！

## 🏗️ プロジェクト構造

```
src/
├── entrypoint/          # 各Workerのエントリーポイント
│   ├── dev.ts          # 開発環境（全ルート含む）
│   ├── entry1.ts       # r1-r3のみ
│   ├── entry2.ts       # r4-r6のみ
│   └── entry3.ts       # r7-r9のみ
├── routes/             # ルート定義
│   ├── r1/             # ルートグループ1
│   ├── r2/             # ルートグループ2
│   └── ...             # r3-r9
└── builder.ts          # hono-builderの設定
```

## 🚀 ビルド & デプロイ

### 1. 依存関係のインストール

```bash
# miseでbun環境を有効化
eval "$(mise activate zsh --shims)"

# 依存関係をインストール
bun install
```

### 2. ビルド

```bash
# 全エントリーをビルド
bun run build

# 個別ビルド
bun run build:dev
bun run build:entry1
bun run build:entry2
bun run build:entry3
```

### 3. ビルド結果の確認

```bash
dist/
├── dev/
│   └── index.js           # エントリーポイント
├── entry1/
│   └── index.js
├── entry2/
│   └── index.js
└── entry3/
    └── index.js
```

### 4. デプロイ

便利なデプロイスクリプトを使用：

```bash
# バンドルサイズ統計を表示
./deploy.sh --stats

# 全エントリーをドライラン
./deploy.sh --dry-run

# 特定のエントリーをドライラン
./deploy.sh --entry entry1 --dry-run

# 実際のデプロイ（注意：Cloudflare Workersアカウントが必要）
./deploy.sh --entry entry1
./deploy.sh                # 全エントリー
```

## 💡 技術詳細

### エントリーポイントの分割戦略

各エントリーポイントは`import.meta.glob`を使って、必要なルートのみを動的に読み込みます：

```typescript
// entry1.ts - r1,r2,r3のみ読み込み
import.meta.glob('@/routes/(r1|r2|r3)/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })

// entry2.ts - r4,r5,r6のみ読み込み  
import.meta.glob('@/routes/(r4|r5|r6)/**/!(_*|$*|*.test|*.spec).(ts|tsx)', { eager: true })
```

### Vite設定による出力最適化

共通のVite設定で環境変数によりターゲットを切り替え：

```typescript
// vite.config.ts
const entries = {
  dev: {
    input: './src/entrypoint/dev.ts',
    outDir: 'dist/dev'
  },
  entry1: {
    input: './src/entrypoint/entry1.ts',
    outDir: 'dist/entry1'
  }
  // ...
}

export default defineConfig(({ mode }) => {
  const target = process.env.BUILD_TARGET || mode || 'dev'
  const entry = entries[target]
  
  return {
    build: {
      outDir: entry.outDir,
      rollupOptions: {
        input: entry.input,
        output: { entryFileNames: 'index.js' }
      }
    }
  }
})
```

## 🎯 使用例とメリット

### 1. 用途別分割
- **entry1** (r1-r3): 認証・基本API
- **entry2** (r4-r6): データ処理・計算
- **entry3** (r7-r9): ファイル処理・重い操作

### 2. パフォーマンス向上
- 小さなバンドルサイズ → **冷間スタート時間短縮**
- 必要な機能のみ → **メモリ使用量削減**
- 独立したデプロイ → **高可用性**

### 3. 開発効率
- 機能単位での個別デプロイ
- デバッグの容易さ
- スケーラブルなアーキテクチャ

## 🔄 コマンド一覧

| コマンド | 説明 |
|---|---|
| `bun run build` | 全エントリーをビルド |
| `bun run build:dev` | 開発環境をビルド |
| `bun run build:entry1` | entry1をビルド |
| `bun run deploy:entry1` | entry1をデプロイ |
| `./deploy.sh --stats` | バンドルサイズ統計 |
| `./deploy.sh --entry entry1 --dry-run` | ドライラン |

## 📈 次のステップ

この例を拡張して、以下を試してみてください：

1. **環境変数の分離**: 各エントリーに異なる環境設定
2. **データベース分割**: エントリーごとに異なるDB接続
3. **監視・ログ**: エントリー別のメトリクス収集
4. **カナリアデプロイ**: 段階的なトラフィック移行

---

> **hono-builder**は、バンドルサイズを優先した分割により、Cloudflare Workersの性能を最大限に引き出します。
