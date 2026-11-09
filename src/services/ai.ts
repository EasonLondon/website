/**
 * 本地示例的唯一入口。
 * 页面只调用这里。以后若换成真实接口，替换这个文件即可。
 */

export const PERSONALITY_TAGS = [
  '内向高自尊',
  '对“为你好”高度敏感',
  '讨厌和表亲比较',
  '用沉默代替争辩',
  '在意同伴怎么看',
  '对被翻看手机很警惕',
] as const

export type PersonalityTag = (typeof PERSONALITY_TAGS)[number]

export const DEFAULT_TAGS: PersonalityTag[] = [
  '内向高自尊',
  '对“为你好”高度敏感',
  '讨厌和表亲比较',
]

export const TAG_NOTES: Record<PersonalityTag, string> = {
  内向高自尊: '话少的时候，多半是在保全面子。',
  '对“为你好”高度敏感': '这句关心，他听得见压力。',
  讨厌和表亲比较: '别人一出现，他就从谈话里退出。',
  用沉默代替争辩: '不反驳，不代表他认可。',
  在意同伴怎么看: '同学的眼光，有时比家里的话更重。',
  对被翻看手机很警惕: '手机里是他少数还觉得安全的地方。',
}

export const SHORTCUTS = [
  { id: 'silent', label: '#放学不说话' },
  { id: 'grades', label: '#问成绩发火' },
  { id: 'phone', label: '#手机不离手' },
] as const

export type ShortcutId = (typeof SHORTCUTS)[number]['id']

export interface CommunicationTemplate {
  type: '共情句' | '探询句' | '退让句'
  content: string
}

export interface DecodeResult {
  surface_behavior: string
  iceberg_model: {
    water_line_above: string
    water_line_below: string
  }
  communication_templates: CommunicationTemplate[]
  trigger: string
}

export interface OcrLine {
  role: '家长' | '孩子'
  text: string
}

export interface ConflictSummary {
  id: string
  title: string
  summary: string
}

export interface ConflictDetail {
  id: string
  title: string
  summary: string
  setting: string
  opening: string
  startDefense: number
  suggest: string
}

export interface TeenReply {
  reply: string
  landmine: string
  defense: number
  defenseNote: string
}

export interface SlangEntry {
  term: string
  category: string
  literal: string
  circle: string
  metaphor: string
  opener: string
}

export interface WeekPage {
  label: string
  temperature: number
  triggers: string[]
  diary: string
}

type SceneId =
  | 'phone'
  | 'grades'
  | 'silent'
  | 'compare'
  | 'homework'
  | 'door'
  | 'tutor'
  | 'sleep'
  | 'gather'
  | 'topup'
  | 'general'

type Band = 'high' | 'mid' | 'low'
type HitId =
  | 'good'
  | 'compare'
  | 'seize'
  | 'shame'
  | 'lecture'
  | 'grades'
  | 'command'
  | 'empathy'
  | 'ask'
  | 'retreat'
  | 'choice'

interface ScriptTurn {
  high: string
  mid: string
  low: string
  short: string
}

interface ToneLines {
  sharp: string[]
  mild: string[]
}

interface ConflictScene extends ConflictDetail {
  turns: ScriptTurn[]
  onForYourGood: ToneLines
  onCompare: ToneLines
  onSeize: ToneLines
  silent: string[]
  extra: string[]
}

interface DecodeScene {
  surface: string
  above: string
  below: string
  peerBelow: string
  empathy: string
  empathyShort: string
  empathySilence: string
  empathyCompare: string
  ask: string
  askLow: string
  askPeer: string
  retreat: string
  retreatSensitive: string
  retreatPrivate: string
  retreatCompare: string
}

const COMPARE_RE =
  /表弟|表姐|表哥|堂哥|堂姐|别人家|别人都|你看看人|拿来比|跟别人|别人比|别比|比你强|比不上|拿我比|比较(?!担心|容易|好|累|喜欢)/
const GOOD_RE = /为你好|为了你|还不是为了/

const TRIGGER_LABEL: Record<SceneId, string> = {
  phone: '手机管理',
  grades: '成绩催促',
  silent: '回家沉默',
  compare: '和人比较',
  homework: '作业催促',
  door: '说重之后',
  tutor: '补习',
  sleep: '起床',
  gather: '家庭聚会',
  topup: '零花钱',
  general: '当天的对话',
}

const DECODE: Record<SceneId, DecodeScene> = {
  phone: {
    surface: '手机还在手里，提醒会让手握得更紧。',
    above: '头不抬，时间一拖再拖，语气慢慢变冲。',
    below: '屏幕里有他还能自己做主的部分。被突然切断时，他感到的是被闯进。',
    peerBelow: '他也许还怕群里的话一断，明天在同学面前就接不上。',
    empathy: '这个时刻你好像离不开屏幕。它也许是你今天不多的喘气的地方。',
    empathyShort: '你还想在屏幕里再待一会儿。这个我看见了。',
    empathySilence: '你不解释，我也先不把沉默当成顶嘴。',
    empathyCompare: '这件事和别人家的孩子无关。我只看见你还想再看一会儿。',
    ask: '你是想把这一段看完，还是不想说话的时候有个地方可去？',
    askLow: '你如果只想回几个字：看完，或者累了。',
    askPeer: '这里面有没有一层，是怕同学的话你没接上？',
    retreat: '我不抢手机。你自己说一个结束的时间，我按你的来。',
    retreatSensitive: '我先把「我是为你好」收回。你自己定几点停，我不再加理由。',
    retreatPrivate: '我不看你的聊天。我们只约定一个你能接受的放下时间。',
    retreatCompare: '我不拿任何人跟你比。手机的事，只听你打算几点停。',
  },
  grades: {
    surface: '成绩一被提起，火气比分数先到。',
    above: '声音变硬，或者干脆把卷子塞回去。',
    below: '分数在他这里常常等于脸面。他先防备的是失望。',
    peerBelow: '水面下也许还有同学的眼光：分数一旦被比较，他就更不想开口。',
    empathy: '一听到要报分，你整个人都紧了。这个反应我看见了。',
    empathyShort: '你不想在我面前报这个数字。我先不看你。',
    empathySilence: '你不说分数，我也把它当成一种回答。',
    empathyCompare: '我只想听你自己的感觉，不把任何人的分数带进来。',
    ask: '你是不想报数字，还是怕报完之后我们的脸色？',
    askLow: '数字你可以留着。你只需要告诉我：要不要我先安静一会儿。',
    askPeer: '你是在意我的反应，还是在意同学知道这个分数？',
    retreat: '今天可以不报分数。你要是愿意，只告诉我你自己满不满意。',
    retreatSensitive: '我先把「我是为你好」收回。今天不报分也可以，我不追加理由。',
    retreatPrivate: '卷子你自己收着。我不翻书包，也不现在问。',
    retreatCompare: '我不会把你和表亲放在一起说。分数的事，今天可以先停。',
  },
  silent: {
    surface: '进门之后话很少，像是把力气留在了学校。',
    above: '你看见的是短句、躲开的眼神，也许耳机还戴着。',
    below: '他怕一开口，关心就会变成检查。沉默是把门留一条缝，不是把你推开。',
    peerBelow: '他也许还在消化同学之间的一句话，只是不想把那个场面再讲一遍。',
    empathy: '今天话很少。你可以什么都不汇报，我们先把书包放下。',
    empathyShort: '你今天大概不想聊天。我坐远一点。',
    empathySilence: '你不说话，我也把它当成回答。我不再把沉默理解成顶撞。',
    empathyCompare: '我不问别人今天怎么样。你只要到家，就已经够了。',
    ask: '你是想安静一会儿，还是学校里有一件还没消化的事？不想说就摇头。',
    askLow: '如果你不想说，回我一个「还好」就够。我不再追。',
    askPeer: '是学校里的人让你累，还是你只是需要安静？',
    retreat: '我先不问今天发生了什么。等你想说话的时候，我在。',
    retreatSensitive: '我先把「我是为你好」收回。今晚我不提问，也不解释为什么要问。',
    retreatPrivate: '我不查你的消息。你想说的时候再敲门找我。',
    retreatCompare: '我谁都不提。今晚你只要休息就行。',
  },
  compare: {
    surface: '别人的名字一出现，他就从这张桌子上退出去了。',
    above: '脸色沉下来，饭吃得很快，或者直接不接话。',
    below: '他听到的往往不是激励，是「你这样不够」。比较会先伤面子，再伤关系。',
    peerBelow: '如果学校里也在排名，家里再比一次，他会觉得哪里都没有退路。',
    empathy: '刚才那一下，你好像一下子就不想说话了。',
    empathyShort: '你不想被放在别人旁边看。我看见了。',
    empathySilence: '你不反驳，不代表你觉得这句比较没关系。',
    empathyCompare: '刚才拿你去跟别人比，是我说重了。你不用赢过任何人。',
    ask: '你是气那句比较，还是气我根本没问你自己的事？',
    askLow: '你如果只想说一个字，说「别比」就行。',
    askPeer: '是家里的比较让你难受，还是连同学那边也在比？',
    retreat: '这句比较我收回。接下来只谈你，不谈任何人。',
    retreatSensitive: '我收回比较，也收回「我是为你好」。你不用变成别人的样子。',
    retreatPrivate: '我不翻旧账，也不把别人的成绩拿来当你的目标。',
    retreatCompare: '我不把你和表亲放在一起说。你只要按你的节奏来。',
  },
  homework: {
    surface: '作业停在那里，越催越像一堵墙。',
    above: '人在书桌前，笔不动，或者反复离开座位。',
    below: '他不是看不见作业。他是一感到被盯着，就开始用拖延保住一点自己的节奏。',
    peerBelow: '他可能也在意同学的进度，只是不想从你嘴里再听到一次。',
    empathy: '看着这些作业，你好像已经烦了。这个烦，我先不处理掉。',
    empathyShort: '你现在不想被盯着写。我先离开书桌。',
    empathySilence: '你不动笔，我也不把这理解成故意气我。',
    empathyCompare: '别人写没写完，跟你这张桌子无关。',
    ask: '你是不知道从哪题开始，还是一想到要做完就想逃？',
    askLow: '你点一下头或摇一下头就行：要不要我先出去。',
    askPeer: '是题目本身难，还是怕做错了被人看见？',
    retreat: '我不坐在旁边看。你自己定先写哪一科，写二十分钟也算开始。',
    retreatSensitive: '我先把「我是为你好」收回。今晚不追加任务，你定开始的时间。',
    retreatPrivate: '我不翻你的草稿，也不中途检查。到点我只问要不要休息。',
    retreatCompare: '我不说别人做到哪了。你今晚的量，你自己定一个我能听见的。',
  },
  door: {
    surface: '门关上了。刚才的话还留在门板上。',
    above: '灯亮着，人不出来，敲门也只有很短的回应。',
    below: '他需要这扇门先替他挡住下一句。不是要赢，是还没从那句话里出来。',
    peerBelow: '如果重话是当着别人说的，他要先把面子捡回来，才会开门。',
    empathy: '你还在气刚才那句。我先不进门。',
    empathyShort: '你需要门先关着。我站远一点。',
    empathySilence: '你不说话，我就在门外等着，不再问对错。',
    empathyCompare: '门外没有别人，只有我。我不再把任何人扯进来。',
    ask: '你是希望我先离开走廊，还是希望水放在门口就好？',
    askLow: '你敲一下门板也行：一声是要水，两声是先走。',
    askPeer: '刚才那句，有没有让你觉得在别人面前丢了面子？没有的话，就当我没问。',
    retreat: '我刚才那句说重了。今晚我不再敲，水放在门口。',
    retreatSensitive: '那句重话我收回，包括任何「为你好」。今晚我不解释。',
    retreatPrivate: '我不过去看你在不在看手机。门你想开再开。',
    retreatCompare: '我不找别人当例子。今晚只有一句：刚才是我的问题。',
  },
  tutor: {
    surface: '「不去」说了很多次，书包还是被拎了起来。',
    above: '人拖着，时间到了还在找理由，或者干脆拒绝出门。',
    below: '他拒绝的也许不是学习，是那个让他觉得被展览、跟不上、又不能离开的房间。',
    peerBelow: '他也许在意班里的人怎么看他提问。这个比课程表更难开口。',
    empathy: '你好像真的不想进那个教室。这个「不想」，我先相信。',
    empathyShort: '你不去，不是一句话能劝动的。我先不拉你。',
    empathySilence: '你不解释原因，我也不把沉默当成偷懒。',
    empathyCompare: '别人去不去那个班，不作为你今晚的理由。',
    ask: '你最不想面对的，是老师、题目，还是坐在那里的感觉？',
    askLow: '你可以用一个词回答：累，难，或者怕。',
    askPeer: '是课本身，还是在同学面前问问题让你难受？',
    retreat: '这周的课我先停一下。我们不现在讨论退费和前途。',
    retreatSensitive: '我先把「我是为你好」收回。这周不去，我不再加一段道理。',
    retreatPrivate: '我不向老师打听你在班里的样子。你自己说要不要继续。',
    retreatCompare: '我不说谁还在上。这个班去不去，先听你的理由。',
  },
  sleep: {
    surface: '周末的上午还关着，人没有准备好被一天抓住。',
    above: '窗帘拉着，叫了几次也还是困，或者干脆不回应。',
    below: '他要的常常不是无限地睡，是一个没有清单的早晨。被叫醒的方式，比时间本身更刺。',
    peerBelow: '有时赖着不起，是因为醒来就要回到同学和任务里，那一头已经很累。',
    empathy: '你看起来还没睡够。我先不拉开窗帘。',
    empathyShort: '你还想再睡一会儿。我退出去。',
    empathySilence: '你不答应起床，我也不把这当成作对。',
    empathyCompare: '别人家的孩子几点起，跟你这张床无关。',
    ask: '你是身体还困，还是一起床就要听安排，所以想躲？',
    askLow: '你要是醒着，哼一声就行。我不再问第二句。',
    askPeer: '是单纯想睡，还是怕起来就要面对同学那些事？',
    retreat: '你再睡四十分钟。起来之后今天的事你来定，我先不列清单。',
    retreatSensitive: '我不再说「为你好才叫你」。四十分钟后你自己开门就好。',
    retreatPrivate: '我不开门检查你在不在看手机。到点我敲一下就走。',
    retreatCompare: '我谁的作息都不提。你今天的节奏，你起来再说。',
  },
  gather: {
    surface: '聚会还没开始，人已经想从场面里消失。',
    above: '找理由留在家里，或者到了也不打招呼，眼睛看着别处。',
    below: '他怕的多半不是亲戚，是那些一进门就落到自己身上的问题，尤其是学习和比较。',
    peerBelow: '如果同龄的亲戚也在，他会提前进入比较，所以身体先选择不出现。',
    empathy: '这种局让你想躲。这个我能理解，不是你不懂礼貌。',
    empathyShort: '你不想去当那个被提问的人。我知道。',
    empathySilence: '你不说想去还是不想去，我先不再劝。',
    empathyCompare: '我不会在那张桌上把你和谁比较。这是我的事。',
    ask: '你最希望我帮你挡住的，是哪一种问题？',
    askLow: '你点一个就行：不去，或者去但我不说话。',
    askPeer: '你是怕亲戚问，还是怕遇到同龄人不知道怎么处？',
    retreat: '学习的问题我来挡。你可以不去当主角，待一会儿就走也行。',
    retreatSensitive: '我不用「为你好」劝你出门。你定去不去，我接受。',
    retreatPrivate: '我不会在路上叮嘱你怎么表现，也不事后追问你跟谁说了话。',
    retreatCompare: '我答应今晚不提任何同龄人的成绩。你只需要决定人在不在。',
  },
  topup: {
    surface: '一笔游戏里的钱，变成了价值观的审判。',
    above: '他反复提这一次，你反复说不行，两边的声音都越来越硬。',
    below: '他想要的常常不只是那个皮肤，是自己做一次决定，并且这个喜欢被当成正经事来听。',
    peerBelow: '同学都有的时候，不买也会变成一种被落下的感觉。这和他懂不懂花钱是两件事。',
    empathy: '这个东西对你是认真的。我先不把它说成浪费。',
    empathyShort: '你很想自己决定这一次。我听见了。',
    empathySilence: '你不再解释，不代表你觉得自己的喜欢可笑。',
    empathyCompare: '别人充不充，我不拿来当你的标准，也不拿来当拒绝的理由。',
    ask: '你愿意讲讲，它为什么重要吗？不想讲，就只说要不要我听。',
    askLow: '你想让我听原因，还是只想要一个准或不准？回一个词就行。',
    askPeer: '是你自己喜欢，还是同学都有，你不想被落下？',
    retreat: '我先不说行或不行。在我决定之前，我不再讲道理。',
    retreatSensitive: '我先把「我是为你好」放下。今天不把零花钱上升成人生。',
    retreatPrivate: '我不翻消费记录来审你。你要是愿意，自己告诉我这个月已经花了多少。',
    retreatCompare: '我不说别人家给不给充。这件事只剩你的理由和我的担心，分开谈。',
  },
  general: {
    surface: '这句话里，靠近和检查缠在一起。孩子通常会先听见检查。',
    above: '句子也许不重，但结论站在了前面。',
    below: '他在判断：接话会更糟，还是接话能被接住。',
    peerBelow: '有些话他不接，是因为一旦说开，就可能被带到学校里继续发酵。',
    empathy: '我听见我自己有点急。你不用马上接我。',
    empathyShort: '你现在也许不想接。我等一下。',
    empathySilence: '你沉默的话，我就当这是回答，不再补一句。',
    empathyCompare: '这句话里不该有别人。我只对着你说。',
    ask: '刚才那句，你听到的是关心，还是指责？',
    askLow: '你用一个词告诉我就行：急，还是重。',
    askPeer: '你在意的是我怎么说，还是怕这件事被同学知道？',
    retreat: '这句我先收回。等你想说的时候，我们再谈这件事。',
    retreatSensitive: '我先把「我是为你好」从这句话里拿掉。剩下的，等你愿意再听。',
    retreatPrivate: '我不借这个话题去看你的手机。事情可以以后再说。',
    retreatCompare: '我谁都不拉进来。刚才如果像在比较，我收回。',
  },
}

const SHAME_REPLIES = [
  '你要是这么看我，那我们就没什么好说的。',
  '我知道了。我就是你说的那样。',
  '行。你说完了可以出去了。',
]

const SCENES: ConflictScene[] = [
  {
    id: 'phone',
    title: '手机不离手',
    summary: '提醒了两次，人还在屏幕里。',
    setting: '晚饭后，手机还亮着。你已经提醒了两次。',
    opening: '我就再看一会儿，你别站在我后面。',
    startDefense: 60,
    suggest: '我不过去站着。你来定几点停，我不催。',
    turns: [
      {
        high: '你要是来收手机的，现在就可以走了。',
        mid: '我就看一会儿，至于要在我后面站着吗？',
        low: '你别站那么近。我看完这个就抬头。',
        short: '别站我后面。',
      },
      {
        high: '我说了最后一会儿。你能不能别数我。',
        mid: '我知道时间不早。你越催，我越想继续看。',
        low: '其实我也有点看不进去了。你一说，我就想对着干。',
        short: '别数我。',
      },
      {
        high: '手机里的事，跟你没关系。',
        mid: '同学还在发消息。我一放下，明天就接不上。',
        low: '有些话我只想在手机里说。不是坏事，就是不想被问。',
        short: '跟你没关系。',
      },
      {
        high: '你再念，我就把门关上。',
        mid: '你要是答应不翻我的聊天，我可以自己定时间。',
        low: '十一点半我自己停。你别中途进来检查。',
        short: '别念了。',
      },
      {
        high: '行。手机你拿走，话我也没有了。',
        mid: '再看十分钟。之后你别发表情。',
        low: '那就十一点半。到了你要是还醒着，敲一下门就好。',
        short: '行吧。',
      },
    ],
    onForYourGood: {
      sharp: [
        '你每次都说为你好。我最不想听的就是这句。',
        '为了我，就可以站在后面看我在跟谁说话吗？',
        '眼睛我自己会照顾。请你把这句收回去。',
      ],
      mild: [
        '你说为你好的时候，我还是会想顶回去。',
        '这句我听过很多次。你可以直接说眼睛。',
        '你要不说为你好，我也许还能听。',
      ],
    },
    onCompare: {
      sharp: [
        '别人家的手机怎么管，跟我有什么关系。',
        '你要觉得表弟做得好，别说给我听。',
        '一比较，这个话题就结束了。',
      ],
      mild: [
        '你一提别人，我就不知道这句话还跟我有没有关系。',
        '别把别人的事混进来，我还能谈。',
        '比较我会先记下，后面的话就听不见了。',
      ],
    },
    onSeize: {
      sharp: [
        '你敢没收，我明天什么都不会再说。',
        '密码我不会给。你别试。',
        '交出来也可以。那我们以后就这样。',
      ],
      mild: [
        '你要收手机，我就只剩反抗了。',
        '先别碰它。碰了我就没法好好说。',
        '我们可以谈时间，不要谈上交。',
      ],
    },
    silent: ['……', '嗯。', '你说完了吗？', '随便。', '哦。'],
    extra: [
      '我不是故意气你。',
      '你安静一点，我也许会自己停。',
      '那些消息我想自己处理。',
      '时间可以谈，检讨不想谈。',
      '就这些，你别再加一句。',
    ],
  },
  {
    id: 'grades',
    title: '成绩下滑',
    summary: '你想问清楚，他已经不耐烦。',
    setting: '试卷露出一个角。他还没说话，已经把话堵上了。',
    opening: '看就看了，你别问我多少分。',
    startDefense: 70,
    suggest: '卷子我先不看。你要是愿意，只告诉我你自己气不气。我不催。',
    turns: [
      {
        high: '别问。问我就火。',
        mid: '考砸了。你想听的就这句。',
        low: '我不想在你看我的时候说分数。',
        short: '别问。',
      },
      {
        high: '我说了考砸了还要怎样。',
        mid: '比上次低了不少。数字我现在不想报。',
        low: '我自己已经很难受了。你要是再失望，我就只能吵。',
        short: '还要怎样。',
      },
      {
        high: '你是不是又要说我玩手机玩的。',
        mid: '有一道大题我看走眼了。不是没学。',
        low: '后面那题我会。一紧张就空了。我怕你只看见空的那一块。',
        short: '别扯手机。',
      },
      {
        high: '从现在开始别跟我谈学习。',
        mid: '补习我知道你会提。今天先别提。',
        low: '你要是想帮忙，就别在饭桌上提。我自己会把错题看一遍。',
        short: '别谈了。',
      },
      {
        high: '说完没有。说完我回屋。',
        mid: '分数在卷子上。你要看就自己看，看完别找我。',
        low: '明天我可以告诉你分数。今晚让我自己待着，行吗？',
        short: '回屋了。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以我连难过都得按你的方式来吗？',
        '你要真为我好，就今天别提这两个字。',
        '我听着像指责。不是关心。',
      ],
      mild: [
        '为你好这三个字一出来，分数就更说不出口了。',
        '你可以直接说你担心。不用包一层理由。',
        '把这句放下，我也许还能讲错在哪。',
      ],
    },
    onCompare: {
      sharp: [
        '表弟多少分，跟我这张卷子有关系吗？',
        '你一说别人，我就知道这谈话没有我了。',
        '那你去夸他啊。',
      ],
      mild: [
        '别人的分数你要是先说了，我的就不用说了。',
        '我可以接受你担心，不接受你拿人来比。',
        '比完我就只想走。',
      ],
    },
    onSeize: {
      sharp: [
        '收手机也改变不了这张卷子。',
        '你要翻我手机找原因，那原因就是你不信任我。',
        '密码没有。你别在分数之后再开第二场。',
      ],
      mild: [
        '先别把手机扯进来。这是卷子的事。',
        '你要查我，我就更不想说分数。',
        '手机今晚可以放下。人你别审。',
      ],
    },
    silent: ['……别问。', '嗯。', '你说完了吗？', '随便。', '我回屋了。'],
    extra: [
      '我不是想瞒你。',
      '数字我自己知道就够难受了。',
      '我想先自己看一遍错题。',
      '你要是脸色不变，我明天可以说。',
      '今晚就到这儿。',
    ],
  },
  {
    id: 'silent',
    title: '放学不说话',
    summary: '进门只有一句到家了。',
    setting: '门开了，书包放下。你问今天怎么样，他没接。',
    opening: '到家了。',
    startDefense: 64,
    suggest: '今天可以什么都不说。我先不问，你来定。',
    turns: [
      {
        high: '别问。没有怎么样。',
        mid: '就那样。',
        low: '有点累。先让我坐一会儿。',
        short: '没什么。',
      },
      {
        high: '你每句都像在检查作业。',
        mid: '我不是不说话。我是不知道从哪句说。',
        low: '学校的事我想先放一放。不是瞒你。',
        short: '别检查。',
      },
      {
        high: '你要听故事还是听成绩。我两个都不想讲。',
        mid: '今天有点吵。我不想把吵再带回家。',
        low: '有件小事，但我现在说会说得很冲。等我洗完脸，也许能说。',
        short: '不想讲。',
      },
      {
        high: '我进房间了。你别跟进来。',
        mid: '你要是只是想确认我还好，那我还好。',
        low: '你可以敲门。别一进门就开灯谈话。',
        short: '别跟。',
      },
      {
        high: '嗯。',
        mid: '今晚就算了。真的没事，别脑补。',
        low: '那你等我。我如果出来倒水，你可以问一句今天累不累。只问这一句。',
        short: '嗯。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为你好，所以进门就要汇报吗？',
        '我今天没有力气听这句。',
        '你把为你好收回，我也许还能坐一会儿。',
      ],
      mild: [
        '这句我会自动听成检查。',
        '你要关心，可以不问内容。',
        '别解释你是为了我。我听见了，也很累。',
      ],
    },
    onCompare: {
      sharp: [
        '别人放学有多少话，跟我无关。',
        '你要聊天，去找那个话多的。',
        '一比我就更不想开口。',
      ],
      mild: [
        '别用别人的热闹要求我。',
        '我话少，不是比谁差。',
        '你只问我累不累就行。',
      ],
    },
    onSeize: {
      sharp: [
        '进门就想看我手机，那我以后不进门。',
        '没有什么需要你检查的。',
        '你翻的话，我连「到家了」都不想说。',
      ],
      mild: [
        '手机先别看。我只是不想说话。',
        '不是有秘密。是没电了。',
        '你要是不碰它，我可以在客厅坐一会儿。',
      ],
    },
    silent: ['……', '嗯。', '没什么。', '你说。', '哦。'],
    extra: [
      '我不是在生你的气。',
      '让我先把学校放下。',
      '有的事我想自己消化。',
      '你在就行，先别问。',
      '等会儿如果我出来，你再看我的脸色。',
    ],
  },
  {
    id: 'compare',
    title: '被拿来比较',
    summary: '你随口一比，他整晚不说话。',
    setting: '饭桌上你说了一句表弟这次也不错。空气立刻变了。',
    opening: '你又提他干嘛。',
    startDefense: 74,
    suggest: '刚才是我多嘴了。对不起。还谈不谈，你来定。',
    turns: [
      {
        high: '那你让他来吃饭啊。看我干什么。',
        mid: '我知道他好。你不用说第二遍。',
        low: '你一提他，我后面的话就没有了。',
        short: '别提他。',
      },
      {
        high: '我怎么样你看不见，就看见别人。',
        mid: '我不是要你夸我。我是不想在饭桌上被拿去比。',
        low: '我有自己的进度。你要是担心，直接问我，别绕到他身上。',
        short: '看不见我。',
      },
      {
        high: '行，我差。满意了吗？',
        mid: '你觉得这是激励。我听到的是你不满意。',
        low: '我其实也想让你高兴。可一比较，我就只想离席。',
        short: '满意了吧。',
      },
      {
        high: '以后家庭聚会我可以不去。省得你比较。',
        mid: '你要再比，我就当没听见。',
        low: '你要是愿意把刚才那句收回，我们可以聊点别的。',
        short: '不想去了。',
      },
      {
        high: '吃完了。我回屋。',
        mid: '这件事到此。别再解释你是随口一说。',
        low: '那你下次直接问我。我可以接受你担心，不接受你拿人来比。',
        short: '回屋。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，就可以把我放在别人旁边展览吗？',
        '这句激励我一句都没有收到。',
        '你要是为了我，就别再提他。',
      ],
      mild: [
        '为你好不能当成比较的借口。',
        '你担心我可以直说。别绕到别人身上。',
        '把这句理由放下，我还能留在桌上。',
      ],
    },
    onCompare: {
      sharp: [
        '又是他。你能不能有一次不提。',
        '我听到的只有：你不行。',
        '比完了吧。我吃好了。',
      ],
      mild: [
        '你一比，我就从这顿饭里退出去了。',
        '我不是要赢他。我是不想被摆在一起。',
        '下次你担心，就说担心。别说别人。',
      ],
    },
    onSeize: {
      sharp: [
        '收手机也证明不了谁更优秀。',
        '你要靠翻手机来比较，那更说明你不看我。',
        '别碰我的东西。比较已经够了。',
      ],
      mild: [
        '手机跟他没有关系。你别混在一起说。',
        '先把比较停了，别的我还可以谈。',
        '你不翻，我也许还能把饭吃完。',
      ],
    },
    silent: ['……', '嗯。', '别说了。', '随便。', '吃完了。'],
    extra: [
      '我没有讨厌他。',
      '我只是不想在饭桌上被摆进去。',
      '你要是收回，我可以留下。',
      '我自己知道哪里还不行。',
      '下次直接问我就行。',
    ],
  },
  {
    id: 'homework',
    title: '作业一直拖',
    summary: '越催，笔越不动。',
    setting: '灯开了，练习册还在第一页。你已经催了三次。',
    opening: '我会写。你别看着我写。',
    startDefense: 58,
    suggest: '我不坐在旁边，也不催。先写哪一科，你来定。',
    turns: [
      {
        high: '看着我我就一个字都写不出来。',
        mid: '我知道要写。你再说我就去倒水。',
        low: '你出去一下。我自己开始，比你盯着快。',
        short: '别看我。',
      },
      {
        high: '写写写。你除了这个还会说什么。',
        mid: '我不是不会。我是一想到要做完就烦。',
        low: '今天的量有点多。我想先写二十分钟，再休息。',
        short: '还会说什么。',
      },
      {
        high: '你要写你自己写。',
        mid: '数学我可以现在写。别的别塞在同一小时里。',
        low: '你帮我把手机拿到客厅。但别在我写的时候进来汇报。',
        short: '你自己写。',
      },
      {
        high: '催也是这样。不催也是这样。',
        mid: '我怕写完你又加一张。所以我干脆不动。',
        low: '我们说好就这些。写完你别临时加题，我就能开始。',
        short: '反正一样。',
      },
      {
        high: '关上门我也许会写。你在外面我就不会。',
        mid: '十一点前我写完数学。别的明天再说，你现在别争。',
        low: '那我现在写数学。你半小时后再来，只看我有没有开始，不看对错。',
        short: '把门关上。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以必须在你眼皮底下写完吗？',
        '这句不会让笔动起来。',
        '你把理由收回，人退出去，我也许会写。',
      ],
      mild: [
        '为你好我听成了监督。',
        '你可以直接说你着急。不用教育我。',
        '少一句道理，我更能开始。',
      ],
    },
    onCompare: {
      sharp: [
        '别人写完了是别人的桌子。',
        '你要找对照，别找我。',
        '一比我就更不想动。',
      ],
      mild: [
        '别告诉我谁已经写完了。',
        '我自己的量我知道。',
        '你只问我从哪科开始就行。',
      ],
    },
    onSeize: {
      sharp: [
        '没收了我就对着空桌子坐着。',
        '你要手机还是要作业，选一个逼我。',
        '拿走也可以。字你别想今天看见。',
      ],
      mild: [
        '手机可以放客厅。人别站在旁边。',
        '你一收，我就只想跟你耗。',
        '我们谈放下，不谈上交。',
      ],
    },
    silent: ['……', '嗯。', '你出去。', '随便。', '关门。'],
    extra: [
      '我知道它在那儿。',
      '我不是不会做。',
      '我想自己决定顺序。',
      '写完请你别加题。',
      '你半小时后再来就好。',
    ],
  },
  {
    id: 'door',
    title: '房门关上了',
    summary: '重话说过之后，房间静了。',
    setting: '刚才有一句说重了。门在里面关上，灯还亮着。',
    opening: '你别敲了。',
    startDefense: 82,
    suggest: '我刚才那句说重了。今晚不再敲。对不起。',
    turns: [
      {
        high: '走。现在不要跟我说话。',
        mid: '你再敲我就把耳机戴上。',
        low: '我听到了。你先别进来。',
        short: '走。',
      },
      {
        high: '道歉不用。你出去就行。',
        mid: '我知道你不是故意的。可我现在看见你就还是气。',
        low: '你把那句放下。我想自己待一会儿，不是要惩罚你。',
        short: '出去。',
      },
      {
        high: '没有什么好谈的。',
        mid: '你要谈对错，我就不开门。',
        low: '我不是想赢。我是需要这扇门先关着。',
        short: '不谈。',
      },
      {
        high: '明天再说。今晚不要做和解表演。',
        mid: '水你可以放门口。人不要站着等我开门。',
        low: '等我出来洗脸。如果你还在客厅，我们可以不说话地待一会儿。',
        short: '别表演。',
      },
      {
        high: '嗯。别再敲。',
        mid: '我还没准备好。你回你的房间就帮我了。',
        low: '十五分钟后我出来倒水。你要是想说对不起，一句就够，别加但是。',
        short: '别敲。',
      },
    ],
    onForYourGood: {
      sharp: [
        '到现在还说为你好。那你继续在门外说。',
        '这句我今晚不会开。',
        '收回它，比敲门有用。',
      ],
      mild: [
        '为你好现在听着像不让我生气。',
        '你要道歉，就只道歉。',
        '别再解释你的出发点。',
      ],
    },
    onCompare: {
      sharp: [
        '别人不会把门关上，是吗？那你去找别人。',
        '这种时候还比，我更不会开。',
        '他怎么样跟这扇门无关。',
      ],
      mild: [
        '别把别人拉到门口来。',
        '我气的是刚才那句，不是谁更懂事。',
        '你只对着我说就行。',
      ],
    },
    onSeize: {
      sharp: [
        '你要是闯进来拿手机，这扇门以后就锁死。',
        '现在碰我的东西，就是第二句重话。',
        '别试密码。',
      ],
      mild: [
        '手机不在这场里。你别扩大。',
        '你站远一点，比把东西收走有用。',
        '今晚什么都别没收。',
      ],
    },
    silent: ['……', '走。', '别敲。', '嗯。', '出去。'],
    extra: [
      '我不是要惩罚你。',
      '我只是还没冷却。',
      '门先替我说一会儿。',
      '水可以放着，人别等。',
      '一句对不起就够，别加但是。',
    ],
  },
  {
    id: 'tutor',
    title: '不想去补习',
    summary: '「我不要去」变成每晚的仗。',
    setting: '补习的时间到了。书包被拎起来，又放了回去。',
    opening: '我说了不去。你还报名。',
    startDefense: 66,
    suggest: '这周的课我先放下。原因我听你的，我不逼。',
    turns: [
      {
        high: '你交了钱也是你的事。我不去。',
        mid: '我去了也是在那儿坐着耗。你不知道吗？',
        low: '我不是想偷懒。那个班我跟不上他们的节奏，坐着像被展览。',
        short: '不去。',
      },
      {
        high: '别用钱压我。',
        mid: '退费你要是心疼，就别再拿来压我。',
        low: '钱的事我知道。可我再去，也只是让你觉得钱没白花。',
        short: '别压我。',
      },
      {
        high: '你要面子就你自己去上课。',
        mid: '同学都好像很会。我问问题会被看。',
        low: '我可以自己把错题弄懂。你要是不放心，周末看我一页，而不是把我送过去。',
        short: '你自己去。',
      },
      {
        high: '再说我就装睡。',
        mid: '这个班我真的不想再进门。你先别找替代方案。',
        low: '你要是担心成绩，我们单独谈成绩。别把补习当成唯一的答案。',
        short: '我睡了。',
      },
      {
        high: '不去就是不去。',
        mid: '这周我不去。你要看，就看作业，别看我人在不在教室。',
        low: '这周让我自己试。如果我完全不动，你再来跟我谈，我听。',
        short: '不去。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以我的不想不算数吗？',
        '报名之前你问过我吗？',
        '这句我从报班听到现在，还是不想去。',
      ],
      mild: [
        '你说为你好的时候，我只听见你已经决定了。',
        '担心可以说。决定先放一放。',
        '少一句道理，我还能解释为什么不想进那扇门。',
      ],
    },
    onCompare: {
      sharp: [
        '别人都在上，所以我也得上。是这个逻辑吗？',
        '那你让他们替我坐着。',
        '一比我就更不去。',
      ],
      mild: [
        '别用别人的课表压我。',
        '我跟不上的是这个班，不是人生。',
        '你只听我的原因就行。',
      ],
    },
    onSeize: {
      sharp: [
        '不去上课，你就收手机。那我们两件一起吵。',
        '拿东西威胁我出门，我可以不出门。',
        '你收走也改变不了那个教室。',
      ],
      mild: [
        '手机和补习是两件事。',
        '你别用没收换我到教室。',
        '这周的课先停，别的别混进来。',
      ],
    },
    silent: ['……不去。', '嗯。', '你说。', '随便。', '我睡了。'],
    extra: [
      '我不是想浪费你的钱。',
      '坐在那里我像被看。',
      '我想自己试一周。',
      '错题我可以留到周末。',
      '你要是不逼，我可以把原因说完。',
    ],
  },
  {
    id: 'sleep',
    title: '周末叫不起来',
    summary: '中午了，窗帘还拉着。',
    setting: '周末快中午。你叫了第三次，房间还是暗的。',
    opening: '再让我睡会儿。',
    startDefense: 50,
    suggest: '你再睡一会儿。今天的事你来定，我不催。',
    turns: [
      {
        high: '周末还要被叫，跟上学有什么区别。',
        mid: '我真的困。不是故意跟你作对。',
        low: '我昨晚睡得晚。你让我把这段睡完，我会自己起来。',
        short: '让我睡。',
      },
      {
        high: '你一拉开窗帘我就更不想动。',
        mid: '别念今天有多少事。我起来也会先发呆。',
        low: '我不是废了。我就是需要一个没有人催的上午。',
        short: '别拉窗帘。',
      },
      {
        high: '学习的事下午再说。现在说我就不起。',
        mid: '我可以中午之前起来。你别在门口列清单。',
        low: '你要是把午饭留一点，我起来会吃。别一边叫我一边说我浪费一天。',
        short: '下午再说。',
      },
      {
        high: '我说了会起来。你不信就继续站着。',
        mid: '我设个闹钟。你出去，闹钟比你的声音有用。',
        low: '十一点半。到时候我自己开门。你要是不放心，到点敲一下就走。',
        short: '我设闹钟。',
      },
      {
        high: '行了知道了。',
        mid: '那你先出去。我再躺一会儿，不是装的。',
        low: '十一点半见。你不用再来看我醒没醒。',
        short: '知道了。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以周末也没有自己的早晨吗？',
        '这句像闹钟，而且关不掉。',
        '你要关心我的睡眠，就先离开门口。',
      ],
      mild: [
        '为你好我听成了今天的任务清单。',
        '你可以说你担心我黑白颠倒。别站着念。',
        '给我一段不被叫的时间，比这句有用。',
      ],
    },
    onCompare: {
      sharp: [
        '别人几点起关我什么事。',
        '你要一个早起的，别在我门口找。',
        '一比我就把被子蒙上。',
      ],
      mild: [
        '别告诉我谁已经在学习了。',
        '我的上午不跟任何人赛。',
        '你只需要知道我几点自己开门。',
      ],
    },
    onSeize: {
      sharp: [
        '一大早就谈没收。我可以不起。',
        '手机在枕头边也不代表你能拿走。',
        '你进来拿东西，我就更不睡了，也不起来。',
      ],
      mild: [
        '现在别碰我的手机。我在睡觉。',
        '起来之后可以谈时间。现在不要。',
        '你退出去，比把东西收走更让我愿意起。',
      ],
    },
    silent: ['……', '再睡会儿。', '别拉。', '嗯。', '出去。'],
    extra: [
      '我不是在跟你耗。',
      '身体还没醒。',
      '清单可以等我起来。',
      '闹钟我自己会设。',
      '到点我会开门。',
    ],
  },
  {
    id: 'gather',
    title: '聚会不想去',
    summary: '亲戚一问学习，他只想走。',
    setting: '晚上有亲戚的局。他从下午就开始躲。',
    opening: '我不去。你别拉我。',
    startDefense: 63,
    suggest: '学习的问题我来挡。你来定去不去，我不问。',
    turns: [
      {
        high: '去了就是听人问成绩。你自己去。',
        mid: '我知道是长辈。我一进去就不知道手往哪放。',
        low: '我不是不尊敬他们。我是怕那些问题。',
        short: '你自己去。',
      },
      {
        high: '你要面子，用我的分数去应付，我不干。',
        mid: '他们一问，你就会接话，接着就开始说我。',
        low: '你要是能答应学习的话题你来挡，我可以待一会儿。',
        short: '我不干。',
      },
      {
        high: '比较一句我就走。说到做到。',
        mid: '表弟要是在，我就更不想说话。不是恨他，是场面我受不了。',
        low: '我可以打招呼，可以吃饭。别让我表演一个很会聊天的孩子。',
        short: '我说走就走。',
      },
      {
        high: '那我去，但我全程不想说话，你别瞪我。',
        mid: '去也行。我坐你旁边，有人问我，你接。',
        low: '我跟你一起去。吃饭结束我就先走，你帮我说一声累了。',
        short: '别瞪我。',
      },
      {
        high: '别再做思想工作了。',
        mid: '你要是现在继续劝，我到时候一句话都不说，你别觉得突然。',
        low: '那就这样定。你挡住成绩那些话。我负责人到场，不负责会聊天。',
        short: '别劝了。',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以我得去给场面撑着吗？',
        '这句改变不了那些问题。',
        '你要面子就直说，别说是为我。',
      ],
      mild: [
        '为你好听着像必须到场。',
        '你可以说你希望我去。决定先听我的怕。',
        '少一句道理，我还能告诉你我怕哪一句。',
      ],
    },
    onCompare: {
      sharp: [
        '又是表弟。那我更不去了。',
        '你要比较，现场比就行，不用我在。',
        '我不会当那个被拿来看的人。',
      ],
      mild: [
        '你先答应不比，我再决定去不去。',
        '别人的成绩请你自己挡掉。',
        '一听到名字，我人就已经不想在了。',
      ],
    },
    onSeize: {
      sharp: [
        '不去就收手机。那我可以两样都不配合。',
        '聚会不是用东西换来的。',
        '你拿我的东西压我出门，我更不走。',
      ],
      mild: [
        '手机我可以少看。人你别推。',
        '别用没收当条件。',
        '去不去，和东西无关。',
      ],
    },
    silent: ['……', '不去。', '你说。', '嗯。', '别拉。'],
    extra: [
      '我不是不给长辈面子。',
      '我是不知道怎么接那些问题。',
      '你挡一句，我会轻松很多。',
      '吃饭我可以在。聊天我不行。',
      '你定规矩，我定去不去。',
    ],
  },
  {
    id: 'topup',
    title: '想在游戏里充钱',
    summary: '他想自己决定一次，你先听见了浪费。',
    setting: '他想在游戏里买一个东西。你的第一反应是不行。',
    opening: '就这一次。别人都有。',
    startDefense: 57,
    suggest: '我先不说行或不行。你要是愿意讲，我听。我不催。',
    turns: [
      {
        high: '不给就不给。你别讲大道理。',
        mid: '我知道你会说浪费。我想听的不是这个。',
        low: '我想自己做一次决定。哪怕你最后还是不同意。',
        short: '别讲道理。',
      },
      {
        high: '零花钱是我的，还要审批到这个地步。',
        mid: '我可以少买别的。不是伸手再要一笔。',
        low: '那个皮肤对我来说是高兴。不是你想的那么简单。但我可以解释。',
        short: '还要审批。',
      },
      {
        high: '那我找别人借。你别管。',
        mid: '你一说别人家孩子不充，我就关掉这个话题了。',
        low: '你要是担心习惯，我们可以定一个月的上限。不是今天当面被审。',
        short: '你别管。',
      },
      {
        high: '行，我不要了。你也别再教育我。',
        mid: '我可以等这个月过完。你别现在把游戏说得像过错。',
        low: '那这个月我不充。你也答应我不翻记录来回查。',
        short: '不要了。',
      },
      {
        high: '说完了吧。',
        mid: '你要不同意，直接说不同意。别绕。',
        low: '你要是愿意听我讲它为什么重要，我可以讲两句。你不想听就算。',
        short: '完了吗？',
      },
    ],
    onForYourGood: {
      sharp: [
        '为了我好，所以我的喜欢都不算数。',
        '这句我从零花钱听到现在。',
        '你要拒绝，就拒绝。别说是爱我。',
      ],
      mild: [
        '为你好会把这件事变成审判。',
        '你可以说你担心我上瘾。我听得进担心。',
        '少这句，我还能讲它为什么重要。',
      ],
    },
    onCompare: {
      sharp: [
        '别人家不充，是你拒绝的理由吗？',
        '那别人有的时候你怎么不提。',
        '一比我就不要了，话也不要了。',
      ],
      mild: [
        '别用别人当标准。',
        '我要的不是跟他们一样，是你听我一次。',
        '比较完，这个话题就没有了。',
      ],
    },
    onSeize: {
      sharp: [
        '你要查账单，那以后花一分我都不会告诉你。',
        '记录你可以看，信任就没有了。',
        '没收游戏，钱的事我们也别谈了。',
      ],
      mild: [
        '你可以问这个月花了多少。别自己去翻。',
        '我可以说数字。你别审。',
        '不翻记录，我更能跟你定上限。',
      ],
    },
    silent: ['……', '不要了。', '你说。', '嗯。', '算了。'],
    extra: [
      '我想被当成说得清理由的人。',
      '这不是伸手要一笔额外的。',
      '上限可以谈。',
      '你直接说不同意也行。',
      '我想讲两句，你可以不听。',
    ],
  },
]

const OCR: Record<ShortcutId, OcrLine[]> = {
  silent: [
    { role: '家长', text: '到家了吗' },
    { role: '孩子', text: '到了' },
    { role: '家长', text: '今天怎么样' },
    { role: '孩子', text: '就那样' },
    { role: '家长', text: '就那样是什么意思' },
    { role: '孩子', text: '你能不能让我先坐一会儿' },
    { role: '家长', text: '我问一句都不行吗' },
    { role: '孩子', text: '那你问吧' },
  ],
  grades: [
    { role: '家长', text: '测验卷呢' },
    { role: '孩子', text: '在包里' },
    { role: '家长', text: '多少分' },
    { role: '孩子', text: '你一进门就这个' },
    { role: '家长', text: '我关心你一下怎么了' },
    { role: '孩子', text: '关心就是报分吗' },
    { role: '家长', text: '那你倒是说啊' },
    { role: '孩子', text: '说了你也是那个脸' },
  ],
  phone: [
    { role: '家长', text: '手机先放下' },
    { role: '孩子', text: '这局还有两分钟' },
    { role: '家长', text: '每次都两分钟' },
    { role: '孩子', text: '那你直接关啊' },
    { role: '家长', text: '我是为你好，眼睛不要了' },
    { role: '孩子', text: '行，那你把为你好收回去' },
    { role: '家长', text: '你这什么态度' },
    { role: '孩子', text: '你站我后面的时候，我就这态度' },
  ],
}

const SLANG: SlangEntry[] = [
  {
    term: '红温',
    category: '情绪',
    literal: '脸色发红，像温度上去了。',
    circle: '被一句话或一局游戏点着了，人已经急了。多数时候不是发烧，也不是害羞。',
    metaphor: '情绪来得比语言快。他需要的是降温的时间，不是当场的道理。',
    opener: '你刚才是不是一下子被点着了？我可以等你凉一点再听。',
  },
  {
    term: '抽象',
    category: '情绪',
    literal: '不具体，不好懂。',
    circle: '一种故意荒诞、没头没尾的玩笑。他说「太抽象了」，常常是在笑，不是交不出答案。',
    metaphor: '当正经话没用的时候，荒诞会变成一种比较安全的说法。',
    opener: '这个我没完全看懂。你要是想解释就解释，不想就算了。',
  },
  {
    term: '回血',
    category: '游戏',
    literal: '血回来了，听着像受伤。',
    circle: '游戏里把生命值补回来。生活里是说缓一缓，把精神养回来。',
    metaphor: '他在说自己电量不够。先恢复，再做事，是他能接受的顺序。',
    opener: '你说回血的时候，我理解成你想先把精力养回来。是这样吗？',
  },
  {
    term: 'NPC',
    category: '游戏',
    literal: '游戏里不由玩家控制的角色。',
    circle: '觉得自己没有选择，只能按别人写好的走。有时也用来吐槽某句话太公式。',
    metaphor: '他感到生活被课程和安排写好了。顶一下，有时只是为了确认自己还在。',
    opener: '你是不是觉得自己一直在被安排？哪一件是你还想自己决定的？',
  },
  {
    term: '哈基米',
    category: '二次元',
    literal: '听起来像一个人名，或一句没有意义的话。',
    circle: '猫的拟声梗，带一点撒娇和好玩。多数时候没有恶意。',
    metaphor: '这是同伴之间才放松得出来的声音。他不是变幼稚，是在觉得被允许的地方喘口气。',
    opener: '我听到一个像小猫的声音。这是你们最近觉得好玩的梗吗？',
  },
  {
    term: '吃谷',
    category: '二次元',
    literal: '像在吃谷物或零食。',
    circle: '买动漫周边、徽章、立牌。「吃」是收集，不是把东西吃进嘴里。',
    metaphor: '那些小东西是他情感的锚。花钱的背后，常常是想把喜欢的角色留在身边。',
    opener: '那些小卡片要是对你重要，可以挑一个，给我讲讲它为什么好看。',
  },
  {
    term: '痛包',
    category: '二次元',
    literal: '会痛的包，听起来像受伤。',
    circle: '把喜欢的角色徽章别满的包。这里的「痛」是热爱，不是疼痛。',
    metaphor: '包是他随身的小展览。被说幼稚的时候，收起来的往往是信任。',
    opener: '包上那些徽章，我想先当成你的喜欢。你最舍不得摘下来的是哪一个？',
  },
  {
    term: '班味',
    category: '校园',
    literal: '像在学校或班里沾上的气味。',
    circle: '被课程、规矩和评价耗了一天后，整个人的疲惫感。',
    metaphor: '他把一天的消耗带回了家。沉默有时是在卸下来，不是在排斥你。',
    opener: '今天在学校耗了挺多的吧。回家先不用向我汇报。',
  },
  {
    term: 'i人',
    category: '校园',
    literal: '一个英文字母，加上「人」。',
    circle: '性格说法里偏内向的那一种。不是英语成绩，也不是在说喜欢。',
    metaphor: '他在用一个很短的词保护自己的社交电量。被追问为什么不合群，会让他更想躲。',
    opener: '你是想自己待一会儿，还是想有人在旁边，但先不说话？',
  },
  {
    term: '电子榨菜',
    category: '校园',
    literal: '电子的咸菜。',
    circle: '吃饭时配着看的短视频，像下饭的小菜，用来让神经松开。',
    metaphor: '他需要一点低负担的愉快，帮自己把这一顿吃完。并不等于整个人被屏幕拿走。',
    opener: '吃饭时看点轻松的，我能理解。我们只约定一个结束的时间。',
  },
  {
    term: '爹味',
    category: '关系',
    literal: '像爸爸的口气。',
    circle: '居高临下、什么都要教训一句的感觉。说的是一种语气，不是在骂父亲这个人。',
    metaphor: '他在提醒边界：我想被当成正在长大的人，而不是被管理的对象。',
    opener: '如果我刚才那句像在上课，你可以直接告诉我。',
  },
  {
    term: '搭子',
    category: '关系',
    literal: '搭在一起的伙伴。',
    circle: '只为某一件事结伴的人，比如午饭、学习或打游戏。不等于恋人。',
    metaphor: '他在学一种更轻的靠近：可以一起做事，但不想被定义成必须交代的关系。',
    opener: '搭子是一起做事的人。你只要让我知道人是安全的，细节可以以后再说。',
  },
]

const ICEBREAKERS = [
  {
    question: '如果今天只能留下一件小事被我看见，你希望是哪一件？',
    hint: '晚饭时用。问完就停，不接成绩。',
  },
  {
    question: '今天有没有一个瞬间，你其实想让我知道，但又没说？',
    hint: '摇头也算回答。',
  },
  {
    question: '这周哪一件事，你希望我完全不要给建议？',
    hint: '用来管住你自己，不是让他交作业。',
  },
  {
    question: '如果我今晚少说十句话，你希望少掉的是哪一种？',
    hint: '他可以只给一个词。',
  },
  {
    question: '你最近舍不得放下的那个东西，哪一点让你还想留着？',
    hint: '适合手机冲突的第二天，不要当天用。',
  },
  {
    question: '在学校里，有没有一个时刻你觉得自己还不错？',
    hint: '只听。不要把它升级成表扬。',
  },
  {
    question: '我哪句话会让你马上不想聊了？你可以说一个词。',
    hint: '这是在请他帮你避开雷。',
  },
]

const ACTIONS = [
  {
    title: '去洗把脸',
    detail: '让凉水在手腕上停十秒。十五分钟内，先不要回到刚才那个话题。',
  },
  {
    title: '给自己倒杯温水',
    detail: '喝完之前，不发消息，也不进孩子的房间。',
  },
  {
    title: '到窗边站一会儿',
    detail: '把目光放到最远的地方。十五分钟后，如果还想谈，只用一句话开始。',
  },
  {
    title: '把那句话先写下来',
    detail: '写在自己的备忘录里，不要发给孩子。写完，这一轮就算停住了。',
  },
]

const DIARY_THIS_WEEK = `这周有三次，话是从成绩开始的。我不是一定要瞒着分数。我是一说，声音就会变快。变快以后，饭就不好吃了。

手机也一样。有的时候我只是还在看同学发的东西，怕一放下，明天就接不上。要是先问我「是不是还想再待一会儿」，我大概会自己说一个时间。

表亲那句我没接。我知道可能是随口说的。可我听到的是：你怎么还这样。`

function pause(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function hasTag(tags: readonly PersonalityTag[], tag: PersonalityTag) {
  return tags.includes(tag)
}

function clip(text: string, count: number) {
  const chars = Array.from(text.replace(/\s+/g, '').trim())
  if (chars.length <= count) return chars.join('')
  return `${chars.slice(0, count).join('')}…`
}

function focusQuote(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const child = [...lines].reverse().find((line) => line.startsWith('孩子'))
  const raw = (child ?? lines[0] ?? '').replace(/^孩子[:：]\s*/, '')
  return clip(raw, 26)
}

export function detectScene(text: string, shortcut: ShortcutId | null): SceneId {
  if (/充值|充钱|零花钱|皮肤/.test(text)) return 'topup'
  if (COMPARE_RE.test(text)) return 'compare'
  if (/手机|平板|游戏|屏幕|短视频/.test(text)) return 'phone'
  if (/成绩|分数|考试|排名|测验|多少分|报分|考砸/.test(text)) return 'grades'
  if (/不说话|沉默|放学|不想说|不理|就那样|先坐/.test(text)) return 'silent'
  if (/作业|练习册/.test(text)) return 'homework'
  if (/房门|关门|摔门|敲门/.test(text)) return 'door'
  if (/补习|辅导班/.test(text)) return 'tutor'
  if (/起床|赖床|不起床|窗帘/.test(text)) return 'sleep'
  if (/聚会|亲戚|打招呼/.test(text)) return 'gather'
  if (shortcut) return shortcut
  return 'general'
}

function buildTemplates(scene: DecodeScene, sceneId: SceneId, tags: readonly PersonalityTag[]) {
  let empathy = scene.empathy
  if (hasTag(tags, '用沉默代替争辩') && (sceneId === 'silent' || sceneId === 'door')) {
    empathy = scene.empathySilence
  } else if (hasTag(tags, '讨厌和表亲比较') && sceneId === 'compare') {
    empathy = scene.empathyCompare
  } else if (hasTag(tags, '内向高自尊')) {
    empathy = scene.empathyShort
  }

  let ask = scene.ask
  const peerScenes: SceneId[] = ['grades', 'phone', 'gather', 'tutor', 'topup', 'homework']
  if (hasTag(tags, '内向高自尊')) ask = scene.askLow
  else if (hasTag(tags, '在意同伴怎么看') && peerScenes.includes(sceneId)) ask = scene.askPeer

  let retreat = scene.retreat
  const privateScenes: SceneId[] = ['phone', 'topup', 'silent', 'door']
  const compareRetreat: SceneId[] = ['compare', 'grades', 'gather']
  if (hasTag(tags, '对被翻看手机很警惕') && privateScenes.includes(sceneId)) {
    retreat = scene.retreatPrivate
  } else if (hasTag(tags, '对“为你好”高度敏感')) {
    retreat = scene.retreatSensitive
  } else if (hasTag(tags, '讨厌和表亲比较') && compareRetreat.includes(sceneId)) {
    retreat = scene.retreatCompare
  }

  const templates: CommunicationTemplate[] = [
    { type: '共情句', content: empathy },
    { type: '探询句', content: ask },
    { type: '退让句', content: retreat },
  ]
  return templates
}

export async function decodeUtterance(input: {
  text: string
  shortcut: ShortcutId | null
  tags: readonly PersonalityTag[]
}): Promise<DecodeResult> {
  await pause(560)
  const sceneId = detectScene(input.text, input.shortcut)
  const scene = DECODE[sceneId]
  const quote = focusQuote(input.text)
  let surface = quote ? `你写下的是「${quote}」。${scene.surface}` : scene.surface
  surface += hasTag(input.tags, '内向高自尊')
    ? '以他的方式，短和冲，常常是在护住面子。'
    : '他这次未必只想对抗，话可以慢慢多起来。'

  let below = scene.below
  if (hasTag(input.tags, '在意同伴怎么看')) below += scene.peerBelow
  if (hasTag(input.tags, '内向高自尊')) below += '他用短句保住面子。面子还在，话才有可能回来。'

  return {
    surface_behavior: surface,
    iceberg_model: {
      water_line_above: scene.above,
      water_line_below: below,
    },
    communication_templates: buildTemplates(scene, sceneId, input.tags),
    trigger: TRIGGER_LABEL[sceneId],
  }
}

export async function readScreenshot(input: {
  shortcut: ShortcutId | null
  byteSize: number
}): Promise<{ lines: OcrLine[]; transcript: string }> {
  await pause(780)
  const keys: ShortcutId[] = ['phone', 'grades', 'silent']
  const key =
    input.shortcut && keys.includes(input.shortcut)
      ? input.shortcut
      : keys[Math.abs(input.byteSize) % keys.length]
  const lines = OCR[key]
  const transcript = lines.map((line) => `${line.role}：${line.text}`).join('\n')
  return { lines, transcript }
}

interface Hit {
  id: HitId
  impact: number
  order: number
}

function judgeLine(line: string, tags: readonly PersonalityTag[]) {
  const hits: Hit[] = []
  const takingBack = /收回|不再提|别再说|不说这句/.test(line)
  if (GOOD_RE.test(line) && !takingBack) {
    hits.push({
      id: 'good',
      impact: hasTag(tags, '对“为你好”高度敏感') ? 18 : 8,
      order: 0,
    })
  }
  if (COMPARE_RE.test(line)) {
    hits.push({
      id: 'compare',
      impact: hasTag(tags, '讨厌和表亲比较') ? 18 : 8,
      order: 1,
    })
  }
  if (/交出来|(?<!不)没收|上交|密码|翻看|把手机|砸了|摔了|扔掉|查账单|消费记录/.test(line)) {
    hits.push({
      id: 'seize',
      impact: hasTag(tags, '对被翻看手机很警惕') ? 18 : 8,
      order: 2,
    })
  }
  if (/不懂事|没出息|废物|懒死|无药可救|怎么这么不/.test(line)) {
    hits.push({ id: 'shame', impact: 16, order: 3 })
  }
  if (/你要明白|长大就知道|我在你这个年纪|说了多少遍/.test(line)) {
    hits.push({ id: 'lecture', impact: 8, order: 4 })
  }
  if (/成绩|分数|排名|考成|退步|不及格/.test(line)) {
    hits.push({ id: 'grades', impact: 7, order: 5 })
  }
  if (/必须|马上|立刻|不许|给我停下/.test(line)) {
    hits.push({ id: 'command', impact: 7, order: 6 })
  }
  if (/辛苦|我看到|我注意到|不容易|委屈|我刚才|说重了/.test(line)) {
    hits.push({ id: 'empathy', impact: -10, order: 7 })
  }
  if (/愿意|可以告诉我|你怎么想|你怎么看/.test(line)) {
    hits.push({ id: 'ask', impact: -8, order: 8 })
  }
  if (/先不谈|等你准备好|对不起|我放下|不逼|不催|我不问|先不问|不抢|不没收|收回|按你的来/.test(line)) {
    hits.push({ id: 'retreat', impact: -14, order: 9 })
  }
  if (/你来定|你自己定|自己说一个|你决定|你选|我听你/.test(line)) {
    hits.push({ id: 'choice', impact: -6, order: 10 })
  }

  if (hits.length === 0) {
    const trimmed = line.trim()
    if (/[？?]$/.test(trimmed) && !/为什么|凭什么/.test(trimmed)) {
      hits.push({ id: 'ask', impact: -6, order: 8 })
    } else if (Array.from(trimmed).length <= 6) {
      hits.push({ id: 'command', impact: 5, order: 6 })
    } else {
      hits.push({ id: 'lecture', impact: 3, order: 4 })
    }
  }

  if (hasTag(tags, '内向高自尊')) {
    for (const hit of hits) {
      if ((hit.id === 'command' || hit.id === 'shame' || hit.id === 'lecture') && hit.impact > 0) {
        hit.impact += 4
      }
    }
  }

  const sum = hits.reduce((total, hit) => total + hit.impact, 0)
  const delta = Math.max(-18, Math.min(20, sum))
  const harmful = hits
    .filter((hit) => hit.impact > 0)
    .sort((a, b) => b.impact - a.impact || a.order - b.order)
  return { delta, main: harmful[0]?.id ?? null }
}

function landmineText(
  line: string,
  tags: readonly PersonalityTag[],
  judged: { main: HitId | null; delta: number },
) {
  const snippet = clip(line, 14)
  const quoted = snippet ? `「${snippet}」` : '这句话'
  switch (judged.main) {
    case 'good':
      return hasTag(tags, '对“为你好”高度敏感')
        ? `${quoted}里的「为你好」，他会听成「你不能自己判断」。他对此很敏感，防线会明显升高。`
        : `${quoted}把关心说成了理由。他会先反驳理由，后面的关心就进不去。`
    case 'compare':
      return hasTag(tags, '讨厌和表亲比较')
        ? '一和别人放在同一句里，他会先护住自己。后半句，他已经不在了。'
        : '比较一出现，谈话就变成排名。他会忙着保护自己，听不见你的担心。'
    case 'seize':
      return hasTag(tags, '对被翻看手机很警惕')
        ? '一说到交出来或翻看，他会确认手机是战场。他很警惕这件事，门会关得更快。'
        : '先谈没收，谈话就只剩输赢。谈一个结束的时间，比上交更不容易把门带上。'
    case 'shame':
      return '这句是在给一个人下结论。结论一出口，事情本身就没法谈了。'
    case 'lecture':
      return `${quoted}里的道理有点满。他可能只听见说教，没听见你在担心。`
    case 'grades':
      return '分数放在前面时，人会先缩成一个数字。数字后面的那个人，就没被问到。'
    case 'command':
      return hasTag(tags, '内向高自尊')
        ? '命令会让在意面子的孩子先把自己关严。面子一紧，话就只剩很短的一句。'
        : `${quoted}像一道命令。他会先决定服不服，再决定听不听。`
    default:
      if (judged.delta < 0) {
        return `${quoted}没有急着下结论。踩雷点不明显，他的防线一般会松一点。`
      }
      return `${quoted}里有一点催促。先停半拍，他更可能接得住。`
  }
}

function bandOf(defense: number): Band {
  if (defense >= 72) return 'high'
  if (defense <= 48) return 'low'
  return 'mid'
}

export function defenseNote(value: number) {
  if (value >= 82) return '他基本上只想结束这场谈话'
  if (value >= 72) return '他开始把话收回去'
  if (value <= 48) return '他愿意多说一点'
  return '他还在听，门没有关严'
}

function lineAt(lines: string[], index: number) {
  return lines[Math.min(index, lines.length - 1)] ?? '……'
}

export async function replyAsTeen(input: {
  sceneId: string
  parentLine: string
  turnIndex: number
  defense: number
  tags: readonly PersonalityTag[]
}): Promise<TeenReply> {
  await pause(680)
  const scene = SCENES.find((item) => item.id === input.sceneId)
  if (!scene) {
    return {
      reply: '这个话题我接不住。我们换一个吧。',
      landmine: '场景没有对上。先回到列表，再选一次。',
      defense: input.defense,
      defenseNote: defenseNote(input.defense),
    }
  }

  const judged = judgeLine(input.parentLine, input.tags)
  const defense = Math.max(0, Math.min(100, input.defense + judged.delta))
  const band = bandOf(defense)
  const turn = Math.min(input.turnIndex, 4)
  let reply = ''
  let shaped = false

  if (input.turnIndex >= 5) {
    shaped = true
    reply =
      band === 'low'
        ? '我今天能说的差不多了。你要是还想听，就听刚才比较软的那句。'
        : '我没什么要补的。你让我自己待一会儿吧。'
  } else if (judged.main === 'good') {
    shaped = true
    const pack = scene.onForYourGood
    const sharp = hasTag(input.tags, '对“为你好”高度敏感') || band === 'high'
    reply = lineAt(sharp ? pack.sharp : pack.mild, turn)
  } else if (judged.main === 'compare') {
    shaped = true
    const pack = scene.onCompare
    const sharp = hasTag(input.tags, '讨厌和表亲比较') || band === 'high'
    reply = lineAt(sharp ? pack.sharp : pack.mild, turn)
  } else if (judged.main === 'seize') {
    shaped = true
    const pack = scene.onSeize
    const sharp = hasTag(input.tags, '对被翻看手机很警惕') || band === 'high'
    reply = lineAt(sharp ? pack.sharp : pack.mild, turn)
  } else if (judged.main === 'shame') {
    shaped = true
    reply = lineAt(SHAME_REPLIES, turn)
  } else if (hasTag(input.tags, '用沉默代替争辩') && defense >= 66 && band !== 'low') {
    shaped = true
    reply = lineAt(scene.silent, turn)
  } else if (hasTag(input.tags, '内向高自尊') && band === 'high') {
    shaped = true
    reply = scene.turns[turn]?.short ?? '……'
  } else {
    reply = scene.turns[turn]?.[band] ?? '……'
  }

  if (!shaped && !hasTag(input.tags, '内向高自尊')) {
    reply = `${reply}${lineAt(scene.extra, turn)}`
  }

  return {
    reply,
    landmine: landmineText(input.parentLine, input.tags, judged),
    defense,
    defenseNote: defenseNote(defense),
  }
}

export function listConflicts(): ConflictSummary[] {
  return SCENES.map(({ id, title, summary }) => ({ id, title, summary }))
}

export function getConflict(id: string): ConflictDetail | undefined {
  const scene = SCENES.find((item) => item.id === id)
  if (!scene) return undefined
  return {
    id: scene.id,
    title: scene.title,
    summary: scene.summary,
    setting: scene.setting,
    opening: scene.opening,
    startDefense: scene.startDefense,
    suggest: scene.suggest,
  }
}

export function toneLabel(tags: readonly PersonalityTag[]) {
  if (hasTag(tags, '用沉默代替争辩')) return '语气很短，常常停在省略号'
  if (hasTag(tags, '内向高自尊')) return '防线一高，话就变短'
  return '语气更愿意把原因说完'
}

export function describeProfile(tags: readonly PersonalityTag[]) {
  if (tags.length === 0) {
    return '你还没有选性格标签。解码会用比较普通的说法，沙盘里的语气也更直接。'
  }
  const parts: string[] = []
  if (hasTag(tags, '内向高自尊')) parts.push('解码会把问句放轻，沙盘里防线一高，他就改说很短的话')
  if (hasTag(tags, '对“为你好”高度敏感')) parts.push('退让句会先收回「为你好」，这句话在沙盘里也会顶上来')
  if (hasTag(tags, '讨厌和表亲比较')) parts.push('一提到别人家的孩子，说法会避开比较，防线升得更快')
  if (hasTag(tags, '用沉默代替争辩')) parts.push('他更可能用省略号把谈话停住')
  if (hasTag(tags, '在意同伴怎么看')) parts.push('解码会多留一层同学的眼光')
  if (hasTag(tags, '对被翻看手机很警惕')) parts.push('退让句会先承诺不翻手机')
  return `按现在勾选的性格，${parts.join('；')}。`
}

const CATEGORIES = ['情绪', '游戏', '二次元', '校园', '关系']

export function slangCategories() {
  return CATEGORIES
}

export function searchSlang(query: string, category: string | null) {
  const keyword = query.trim().toLowerCase()
  return SLANG.filter((entry) => {
    if (category && entry.category !== category) return false
    if (!keyword) return true
    const haystack = `${entry.term}${entry.literal}${entry.circle}${entry.metaphor}${entry.opener}`.toLowerCase()
    return haystack.includes(keyword)
  })
}

export function formatToday(date = new Date()) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)
}

export function getDailyIcebreaker(shift = 0) {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime()
  const day = Math.floor((Date.now() - start) / 86_400_000)
  const index = Math.abs(day + shift) % ICEBREAKERS.length
  return ICEBREAKERS[index] ?? ICEBREAKERS[0]
}

export function getTodayTemperature(delta = 0) {
  const degrees = Math.max(58, Math.min(80, 68 + delta))
  let reading = '温着。可以问一句，不必谈完。'
  if (degrees >= 76) reading = '话还热着，适合轻轻靠近，仍然不必一次谈完。'
  else if (degrees >= 70) reading = '比今天早些时候暖一点。可以问一句，不必谈完。'
  else if (degrees <= 62) reading = '有一点凉。先别急着谈事情。'
  return { degrees, reading }
}

export function getMicroAction(seed: number) {
  const index = Math.abs(seed) % ACTIONS.length
  return ACTIONS[index] ?? ACTIONS[0]
}

export function getWeeklyArchive(input: { temperature: number; triggers: string[] }): {
  current: WeekPage
  earlier: WeekPage[]
} {
  return {
    current: {
      label: '本周',
      temperature: input.temperature,
      triggers: input.triggers.length ? input.triggers.slice(0, 2) : ['成绩催促', '手机管理'],
      diary: DIARY_THIS_WEEK,
    },
    earlier: [
      {
        label: '上周',
        temperature: 71,
        triggers: ['起床', '补习'],
        diary: '上周的早晨都很赶。我不是起不来，是一起床就要听今天该做什么。如果窗帘能让我自己拉开，我会好一点。补习的事我说了不去，像是没人听见。',
      },
      {
        label: '再上一周',
        temperature: 63,
        triggers: ['家庭聚会'],
        diary: '家庭聚会我坐在角落。有人问学校，我就看杯子。我希望那句问话被接过去，而不是等我表演一个懂事的回答。',
      },
    ],
  }
}
