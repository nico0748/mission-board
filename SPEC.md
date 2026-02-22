# ミッションボード Web アプリ仕様（リファクタ後）

## 技術スタック
- React 18 + TypeScript + Vite
- Atomic Design 構成（atoms / molecules / organisms / templates）
- 状態保存: `localStorage`（`usePersistentState`）
- スタイル: CSS（ポップ寄り配色・テーマ切替）、Google Fonts (Baloo 2 / Fredoka / M PLUS Rounded 1c)

## ディレクトリ構成
```
src/
  App.tsx                # ルートで状態管理＆AppShellへ委譲
  data/seed.ts           # モックデータ（ミッション/依頼/ショーケース）
  hooks/usePersistentState.ts
  components/
    atoms/               # 最小単位（Pill, Tag, Button）
    molecules/           # 小さめ複合（FilterPill）
    organisms/           # 大きめ UI（MissionCard, Ticker, SettingsDrawer, ShowcaseGrid）
    templates/           # 画面セクション（Header, Hero, MissionBoard, ShowcasePanel, AdminPanel, RequestForm, AppShell）
    icons/Icons.tsx      # コース/タイプ/難易度アイコン辞書
  styles/
    theme.css            # テーマ変数（暖色/寒冷/ダーク）
    app.css              # レイアウト・コンポーネント共通スタイル
  index.css              # グローバルリセット & フォント
index.html               # エントリ（Google Fonts読み込み）
```

## 画面構成
- **Header (templates/Header)**  
  ユーザーアイコン（設定ドロワー起動）、データ初期化ボタン。
- **Hero (templates/Hero)**  
  統計のみ表示。タイトルのみ（ふりがな無し）。
- **MissionBoard (templates/MissionBoard)**  
  - コースタブをクリックして切替（自動スライドなし）。  
  - 各コースのミッションをグリッド表示。スクロール可能領域で収まりを改善。  
  - カード: コース/難易度/タイプ/状態をアイコンタグ表示 + 参加人数/クリア人数。  
  - Admin時は編集/削除/クリア登録フォームを表示。
- **ShowcasePanel (templates/ShowcasePanel)**  
  作品紹介カード群。
- **RequestForm (templates/RequestForm)**  
  一般ユーザー用のミッション依頼送信。
- **AdminPanel (templates/AdminPanel)**  
  Heroより下に配置（初期ビューポート外）。ミッションCRUD、依頼レビュー、PIN変更。
- **SettingsDrawer (organisms/SettingsDrawer)**  
  ロール切替（AdminはPIN要求）、テーマ切替、データ初期化。
- **Ticker (organisms/Ticker)**  
  クリア登録を画面下部固定で流す。

## テーマ
- `warm`（デフォルト）, `cool`, `dark` を `body[data-theme]` で切替。  
  SettingsDrawer から選択。

## 自動動作
- ミッションボードカルーセル: 8 秒毎に自動スライド（手動ボタンあり）。

## 実行方法
1) `npm install`  
2) `npm run dev` で起動（Vite）。

## モックデータ
- ミッション: コース全種、難易度1-3、有効/無効、教師/生徒作成、タイプ各種を網羅。  
- 依頼: 2件（Scratch/LEGO）。  
- 作品紹介: 3件（Scratch/LEGO/Unity）。

## ふりがな
- タイトル/見出しの一部に `.furigana` クラスで小さなふりがなを表示。
