# 構成

## コンポーネント・データ構成図

![ミッションボード コンポーネント・データ構成図](/architecture.svg)

---

## ディレクトリ構成

```
src/
  App.tsx                    # ルート：状態管理・イベントハンドラ
  main.tsx                   # エントリ・ルーティング（react-router-dom）
  types.ts                   # 型定義
  data/
    seed.ts                  # モックデータ
  hooks/
    useGoogleSheets.ts       # Google Sheets API 連携
    usePersistentState.ts    # localStorage 永続化
    useInterval.ts           # 自動スライド用タイマー
    useFullscreen.ts         # 全画面表示制御
  components/
    atoms/                   # 最小単位（Pill / Tag / Button）
    molecules/               # 小複合（FilterPill）
    organisms/               # 大複合（MissionCard / Ticker / SettingsDrawer / ShowcaseGrid）
    templates/               # 画面セクション（Header / Hero / MissionBoard / ...）
    icons/Icons.tsx          # コース・タイプ・難易度 アイコン辞書
  styles/
    theme.css                # テーマ変数（warm / cool / dark）
    app.css                  # レイアウト・共通スタイル
  content/                   # Markdown コンテンツ（紹介ページ用）
  pages/                     # 紹介ページコンポーネント
```

---

## 設計上のポイント

### Atomic Design

UI コンポーネントを `atoms → molecules → organisms → templates` の 4 層で管理しています。下位層のコンポーネントを組み合わせて上位層を構成することで、再利用性と保守性を高めています。

### 状態管理

`usePersistentState` によって `localStorage` に状態を保存し、リロード後も設定・データが保持されます。Google スプレッドシートから取得したデータはローカルのクリア記録とマージされます。

### データソース

Google スプレッドシートをマスターデータとして使用し、`useGoogleSheets` フックで取得します。シートに登録したミッションデータが自動的にボードに反映されます。

### テーマ切り替え

`body[data-theme]` 属性と CSS カスタムプロパティを組み合わせてテーマを切り替えます。コンポーネント側はテーマを意識せず、変数を参照するだけで自動的に切り替わります。
