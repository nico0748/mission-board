# 技術スタック

## 使用技術

| 項目 | 技術 | 備考 |
|------|------|------|
| UI フレームワーク | React 18 | Hooks ベースの設計 |
| 型システム | TypeScript 5 | 厳格な型チェック |
| ビルドツール | Vite 5 | 高速な HMR・バンドル |
| ルーティング | react-router-dom 7 | SPA ルーティング |
| Markdown | react-markdown + remark-gfm | 紹介ページのレンダリング |
| データ連携 | Google Sheets API v4 | ミッションデータのマスター |
| スタイル | 素の CSS（カスタムプロパティ） | ライブラリ不使用 |
| フォント | Google Fonts | 下記参照 |

---

## フォント

| フォント | 用途 |
|----------|------|
| Fredoka | ロゴ・ブランドタイトル |
| Baloo 2 | 見出し・数値 |
| M PLUS Rounded 1c | 本文・UI テキスト全般 |

---

## テーマシステム

`body[data-theme]` 属性で切り替え、3 種類の CSS 変数セットを使い分けます。

| テーマ | 特徴 |
|--------|------|
| `warm`（デフォルト） | 暖色系・ベージュベース |
| `cool` | 寒色系・ダークネイビーベース |
| `dark` | 深いダーク系・パープルアクセント |

---

## データフロー

```
Google Sheets
    ↓ useGoogleSheets（フック）
App.tsx（状態管理）
    ↓ props
AppShell → 各テンプレートコンポーネント

localStorage
    ↑↓ usePersistentState（フック）
App.tsx（設定・依頼・作品データ）
```

---

## 実行方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# プロダクションビルド
npm run build
```
