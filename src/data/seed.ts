import { type Mission, type MissionRequest, type ShowcaseEntry } from '../types';

export const seedMissions: Mission[] = [
  {
    id: 'm-1',
    title: 'かえるジャンプゲーム',
    description: 'スペースキーでジャンプしてコインをあつめよう。かべに当たらないように！',
    course: 'Scratch',
    difficulty: 1,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 8,
    clears: [
      { id: 'c-1', studentName: 'ミナト', clearedAt: new Date().toISOString() },
      { id: 'c-2', studentName: 'ユイ', clearedAt: new Date().toISOString() }
    ]
  },
  {
    id: 'm-2',
    title: '協力型リズムアドベンチャー',
    description: 'ともだちと2人でリズムに合わせてボタンをおしてすすむゲーム。',
    course: 'Unity',
    difficulty: 3,
    missionType: '体験系',
    createdBy: 'teacher',
    status: 'active',
    participants: 10,
    clears: []
  },
  {
    id: 'm-3',
    title: '防災ロボットを動かそう',
    description: 'センサーで障害物をさけて救援物資をとどけるロボットをつくろう。',
    course: 'LEGO SPIKE Prime',
    difficulty: 2,
    missionType: '社会テーマ系',
    createdBy: 'teacher',
    status: 'active',
    participants: 6,
    clears: [{ id: 'c-3', studentName: 'レン', clearedAt: new Date().toISOString() }]
  },
  {
    id: 'm-4',
    title: '3Dペンで未来の乗り物',
    description: '空をとぶ乗り物をデザインして3Dペンで形にしよう。',
    course: '3Dペン',
    difficulty: 1,
    missionType: '体験系',
    createdBy: 'student',
    status: 'inactive',
    participants: 5,
    clears: []
  },
  {
    id: 'm-5',
    title: 'ループで花火シューティング',
    description: 'くり返し（ループ）だけで花火をたくさんうちあげるしくみを作ろう。',
    course: 'Scratch',
    difficulty: 2,
    missionType: '技術縛り系',
    createdBy: 'teacher',
    status: 'active',
    participants: 7,
    clears: []
  },
  {
    id: 'm-6',
    title: '温度センサーでおんどけい',
    description: 'LEGOセンサーをつかって、部屋の温度を表示するプログラムを作成。',
    course: 'LEGO SPIKE Basic',
    difficulty: 2,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 6,
    clears: []
  },
  {
    id: 'm-7',
    title: '迷路をぬけろVR',
    description: 'UnityでシンプルなVR迷路をつくり、三人称視点と一人称視点を切替えよう。',
    course: 'Unity',
    difficulty: 3,
    missionType: '思考系',
    createdBy: 'student',
    status: 'inactive',
    participants: 9,
    clears: []
  },
  {
    id: 'm-8',
    title: '自然を守るポスター',
    description: 'Blenderで地球をモデリングし、環境をまもるメッセージを入れよう。',
    course: 'Blender + 3D造形',
    difficulty: 2,
    missionType: '社会テーマ系',
    createdBy: 'teacher',
    status: 'active',
    participants: 4,
    clears: []
  },
  {
    id: 'm-9',
    title: 'スコアをカウントする',
    description: 'Scratchでスコアをカウントして、ゲームオーバー画面をつくろう。',
    course: 'Scratch',
    difficulty: 1,
    missionType: '機能系',
    createdBy: 'student',
    status: 'active',
    participants: 12,
    clears: []
  },
  {
    id: 'm-10',
    title: '音で反応するライトショー',
    description: 'マイクの音にあわせてLEDが光るデバイスを組み立てよう。',
    course: 'LEGO SPIKE Basic',
    difficulty: 3,
    missionType: '体験系',
    createdBy: 'teacher',
    status: 'active',
    participants: 5,
    clears: []
  },
  {
    id: 'm-11',
    title: 'スネークゲームAI対戦',
    description: 'Unityでスネークゲームを作り、簡単なAIと対戦できるようにする。',
    course: 'Unity',
    difficulty: 3,
    missionType: '思考系',
    createdBy: 'teacher',
    status: 'inactive',
    participants: 4,
    clears: []
  },
  {
    id: 'm-12',
    title: 'くり返し模様のスタンプ',
    description: '3Dペンでパターンをつくり、スタンプにしてみよう。',
    course: '3Dペン',
    difficulty: 1,
    missionType: '技術縛り系',
    createdBy: 'student',
    status: 'active',
    participants: 8,
    clears: []
  },
  {
    id: 'm-13',
    title: 'カラーセンサーで宝さがし',
    description: '色センサーで色を見つけたら音をならすロボットを作ろう。',
    course: 'LEGO SPIKE Prime',
    difficulty: 1,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 6,
    clears: []
  },
  {
    id: 'm-14',
    title: 'ねじねじドリルカー',
    description: '3Dペンでドリルをつくり、回転パーツをうごかしてみよう。',
    course: '3Dペン',
    difficulty: 2,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 5,
    clears: []
  },
  {
    id: 'm-15',
    title: '海のいきもの図鑑',
    description: 'Blenderで海のいきものをモデリングして簡単な図鑑にしよう。',
    course: 'Blender + 3D造形',
    difficulty: 1,
    missionType: '思考系',
    createdBy: 'student',
    status: 'active',
    participants: 3,
    clears: []
  },
  {
    id: 'm-16',
    title: 'エコタウンシミュレーター',
    description: 'Blenderで家と公園を作り、環境にやさしい町をデザインしよう。',
    course: 'Blender + 3D造形',
    difficulty: 2,
    missionType: '社会テーマ系',
    createdBy: 'teacher',
    status: 'inactive',
    participants: 4,
    clears: []
  },
  {
    id: 'm-17',
    title: 'ジャンプ＋スコア＋タイマー',
    description: 'Scratchでジャンプ、スコア、時間制限の3要素をまとめて作ろう。',
    course: 'Scratch',
    difficulty: 2,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 9,
    clears: []
  },
  {
    id: 'm-debug-1',
    title: '【激ムズ】弾幕シューティング',
    description: '画面いっぱいの敵の弾をよける超高難易度ゲーム。',
    course: 'Scratch',
    difficulty: 7,
    missionType: '技術縛り系',
    createdBy: 'teacher',
    status: 'active',
    participants: 2,
    clears: []
  },
  {
    id: 'm-debug-2',
    title: 'マルチプレイFPS',
    description: 'ネットワーク機能を使ってリアルタイム対戦を実装する。',
    course: 'Unity',
    difficulty: 6,
    missionType: '機能系',
    createdBy: 'teacher',
    status: 'active',
    participants: 1,
    clears: []
  },
  {
    id: 'm-debug-3',
    title: 'AIチャットボット',
    description: 'Pythonと連携して会話できるボットを作る（上級者向け）。',
    course: '3Dペン', // Wrong course but just for debug/variation in seed
    difficulty: 5,
    missionType: '思考系',
    createdBy: 'teacher',
    status: 'active',
    participants: 3,
    clears: []
  },
  {
    id: 'm-debug-4',
    title: '複雑なピタゴラ装置',
    description: '物理演算を駆使して1分間動き続ける装置を作る。',
    course: 'Blender + 3D造形',
    difficulty: 4,
    missionType: '思考系',
    createdBy: 'student',
    status: 'active',
    participants: 5,
    clears: []
  }
];

export const seedRequests: MissionRequest[] = [
  {
    id: 'r-1',
    requesterName: 'ソラ',
    title: '光る迷路を作りたい',
    detail: '暗い部屋でも見やすい、LEDを使った迷路ゲームを作りたいです。',
    course: 'LEGO SPIKE Basic',
    missionType: '機能系',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r-2',
    requesterName: 'カナ',
    title: '動物があらわれるパズル',
    detail: 'クリアするとかわいい動物がでてくるパズルゲームがほしい！',
    course: 'Scratch',
    missionType: '思考系',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const seedShowcase: ShowcaseEntry[] = [
  {
    id: 's-1',
    workName: 'スペースダッシュ',
    creator: 'アオイ',
    course: 'Scratch',
    comment: 'ジャンプとダッシュのタイミングが気持ちいい横スクロール。',
    award: 'アイデア賞'
  },
  {
    id: 's-2',
    workName: '森を守るロボット',
    creator: 'レン',
    course: 'LEGO SPIKE Prime',
    comment: 'センサーを使ってゴミを拾い集める優秀なロボット。',
    award: 'チャレンジ賞'
  },
  {
    id: 's-3',
    workName: 'ミントアイス工場',
    creator: 'ミユ',
    course: 'Unity',
    comment: '物理演算でアイスをころがすと色がかわる演出がきれい！',
    award: 'デザイン賞'
  }
];
