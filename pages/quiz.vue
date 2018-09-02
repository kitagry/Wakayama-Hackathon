<template lang="pug">
  v-container(grid-list-md, text-xs-center)
    v-layout(row, wrap, justify-center v-if="count < 5")
      v-flex(xs12)
        v-card
          v-card-title.pl-5 問題 {{ count+1 }}
          v-card-text.pa-5.display-3 {{ randomedQuizs[quizid].question }}
      v-flex.py-0.ma-0(v-for="i in 4", :key="`option${i-1}`", xs6)
        v-card(:class="[ isCorrect(i-1) ? correctClass : (clicked[i-1] ? errorClass : defaultClass) ]")
          v-btn.pb-5.pt-4.display-2(block, flat, @click="judge(i-1)") {{ randomedQuizs[quizid].answer[i-1] }}
      v-flex(xs4)
        v-card.pa-0
          v-btn(block, flat, to="/") クイズをやめる
      v-dialog(v-model="dialog", width="800")
        v-flex(xs12)
          v-card.pa-0
            v-card-title.pl-4 正解は、 {{ correctAnswer(quizid) }}
            v-card-text.py-5 {{ randomedQuizs[quizid].tip }}
    v-content(v-else, fullscreen)
      v-layout(row, wrap, justify-center)
        v-flex(xs12)
          v-card.ma-0(flat)
            v-card-title.pl-4.display-1
              h1.display-3 5
              | 問中、 
              h1.display-3 {{ rate }}
              | 問正解!!
            v-card-text.py-5.display-3 あなたの和歌山度が、
              h1.display-4 {{ wpt }}
              | になりました。
        v-flex(xs4)
          v-card.pa-0
            v-btn(block, to="/") ホームに戻る
</template>

<script>
import _ from  "lodash"

export default {
  data: () => {
    return {
      count: 0,
      rate: 0,
      dialog: false,
      clicked: [false, false, false, false, false],
      defaultClass: '',
      correctClass: 'light-green accent-3',
      errorClass: 'red darken-1',
      quizid: 0,
      quizs: [{question: "7/30,31に開催される茅輪祭は「わくぐり」 と呼ばれ親しまれている夏越の大祓いである。では、この祭りが行われる神社は次のうちどれ？",
               answer: ["伊太祁曽神社", "淡嶋神社", "隅田八幡神社", "闘鶏神社"], correct: 0,
               tip: "人形（ひとがた）に自分の罪・穢れを移して、茅を綱網みにした茅の輪をくぐり、1年間の無病息災を祈願します。\
                     また、当日頒布する小茅輪を持ち帰り玄関に掛けると家族が災厄を逃れると伝えられています"},
              {question: "白浜町にあるテーマパーク「アドベンチャーワールド」で日本動物大賞グランプリを受賞したジャイアントパンダの名前は次のうちどれ？", 
               answer: ["天天", "芳明", "良浜", "永明"], correct: 3,
               tip: "ちなみに永明は25歳。修士卒の新社会人相当。"},
              {question: "和歌山大学には、学歌が二つある。第二学歌のタイトルは次のうちどれ？", 
               answer: ["僕らの MIRAI CAMPUS", "ぼくらの MIRAI CAMPUS", "僕らの WADAI CAMPUS", "ぼくらの WADAI CAMPUS"], correct: 3,
               tip: "キャンパスへの長い階段を　駆け上がると\
                     いつもの仲間がいる　僕らのUNIVERSE\
                     あふれる緑と　さわやかな風に吹かれ\
                     今日も一日　ここから始まる"},
              {question: "次のうち、南海和歌山市駅から川を渡らないで着くラーメン店はどれ？", 
               answer: ["アロチ丸高", "井出商店", "丸京 中華そば店" , "中華そば　丸田屋"], correct: 2,
               tip: "和歌山ラーメンは豚骨と醤油の二種類が有名。"},
              {question: "次のうち、生産量において和歌山が一位でないものはどれ？", 
               answer: ["みかん", "柿", "梅", "もも"], correct: 3,
               tip: "和歌山はももの収穫量が日本で４番なんだって！！"},
              {question: "弘法大師空海と出会った時、狩場明神かりばみょうじんが連れていたのは何の動物であったと伝承されているでしょうか", 
               answer: ["猪", "鹿", "犬", "狼"], correct: 2,
               tip: "空海こうぼうだいしくうかいの旅の目的を聞いた狩場明神かりば\
              みょうじんは、「ここから少し南の紀州（和歌山県）の山中に、\
              あなたの求めているよい場所があります。この犬に案内させましょう。」といって、そのまま姿すがたが見えなくなりました。\
              空海は、狩場明神が連れていた黒と白の２匹の犬に案内され、丹生明神にうみょうじんと出会うことになります"},
              {question: "紀南地方の良質な梅の中でも、粒が大きく肉厚で最高級品とされる梅の品種はどれでしょう？", 
               answer: ["古城梅", "南高梅", "紅さし", "男梅"], correct: 1,
               tip: "温暖な気候に恵まれた紀南地方は良質の梅ができ、なかでも南高梅（なんこううめ）は漬け梅品種としては最高級品。\
                粒が大きく肉厚で、果皮が薄いのが特徴です。梅生産量日本一を誇る和歌山県を代表する品種です。"},
              {question: "歌山県有田川町（旧清水町）が、収穫量で日本一を誇る特産品はどれでしょう？",
               answer: ["山椒", "胡麻", "生姜", "梅"], correct: 0,
               tip: "清水町（現有田川町）の山椒栽培の歴史は古く、江戸時代から薬用として栽培されており、その後、香辛料としても生産されてきました。栽培している品種は、実が大きく、果肉が厚く、辛味が強く、ブドウのように実がつくことから、ブドウ山椒種と呼ばれています。町内全域に約50haの作付面積があり、全国一の生産量を誇っています。\
ピリッとからい山椒は、うなぎの蒲焼や、七味とうがらしに欠かせない香辛料の代表格です。清水地区の山椒は、大粒で香りもよく、最高級の品質といわれています。現在は､粉山椒の他、佃煮、塩漬加工と土産品としても人気を呼んでいます。"},
              {question: "和歌山と言えば「有田みかん」が有名ですが、傾斜地での美味しいみかん作りの秘訣となっている栽培方法は？",
               answer: ["石垣階段", "水田跡地型", "乾季栽培法", "高地栽培型"], correct: 0,
               tip: "有田川が流れる左右の山や、海岸沿いの山々にはみかん畑が広がります。 傾斜地みかん園のほとんどが、石垣階段型の畑です。 石垣は保温効果、排水効果、光の反射効果があり、おいしいみかん作りの秘訣です。\
平坦地のみかん畑でも、おいしいみかんが出来るようにマルチ栽培やハウス栽培が増えています。\
有田みかんの勝負どころは11月からの早生みかんです。品種は宮川早生や興津早生など。 早生みかんは皮が薄く甘みも増しておいしいです。\
12月になると普通みかん（中生・晩生）が出荷されます。中生みかんは向山、晩生は林・丹生・青島などの品種が主に栽培されています。"}
             ],
    }
  },

  methods: {
    isCorrect(x){
        return (x == this.randomedQuizs[this.quizid].correct) && this.clicked[4]
    },
    judge(x){//正誤判定・ダイアログ表示・正解数カウント
        this.clicked[x] = !this.clicked[4];
        this.clicked[4] = true;
        if(this.clicked[this.randomedQuizs[this.quizid].correct] == true){
           this.rate++;
           this.$store.commit('increment');
        }
        this.dialog = true;
    },
    correctAnswer(quizid) {
      return this.randomedQuizs[quizid].answer[this.randomedQuizs[quizid].correct] ;
    }
  },

  computed: {
    wpt () { return this.$store.state.wpt },
    randomedQuizs () { 
      return _.shuffle(this.quizs)
    }
  },

  watch: {
    dialog: function(val) {
      if (!val) {
        var i;
        for (i = 0; i < 5; i++) {
          this.clicked[i] = false;
        } 
        this.count++;
        this.quizid++;
      }
    }
  }
}
</script>
