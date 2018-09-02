<template lang="pug">
  v-container(grid-list-md, text-xs-center)
    v-layout(row, wrap, justify-center)
      v-flex(xs12)
        v-card
          v-card-title.pl-5 問題 {{ count+1 }}
          v-card-text.pa-5 {{ quizs[quizid].question }}
      v-flex.py-0.ma-0(v-for="i in 4", :key="`option${i-1}`", xs6)
        v-card(:class="[ isCorrect(i-1) ? correctClass : (clicked[i-1] ? errorClass : defaultClass) ]")
          v-btn.pb-5.pt-4(block, flat, @click="judge(i-1)") {{ quizs[quizid].answer[i-1] }}
      v-dialog(v-model="dialog", width="800")
        v-flex(xs12)
          v-card.pa-0
            v-card-title.pl-4 正解は、 {{ quizs[quizid].answer[quizs[quizid].correct] }}
            v-card-text.py-5 {{ tips[quizid] }}
      v-dialog(v-model="result", fullscreen)
        v-flex(xs12)
          v-card.ma-0
            v-card-title.pl-4 １０問中、 {{ rate }} 正解!!
            v-card-text.py-5 あなたの和歌山度が、{{ wpt }}になりました。
      v-flex(xs4)
        v-card.pa-0
          v-btn(block, flat, to="/") クイズをやめる
</template>

<script>
export default {
  data: () => {
    return {
      count: 0,
      rate: 0,
      dialog: false,
      result: false,
      clicked: [false, false, false, false, false],
      defaultClass: '',
      correctClass: 'light-green accent-3',
      errorClass: 'red darken-1',
      quizid: 0,
      quizs: [{question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1},
              {question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1},
              {question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1},
              {question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1},
              {question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1},
              {question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1}
             ],
      tips: ["和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
            ]
    }
  },

  methods: {
    isCorrect(x){
        return (x == this.quizs[this.quizid].correct) && this.clicked[4]
    },
    judge(x){//正誤判定・ダイアログ表示・正解数カウント
        this.clicked[x] = !this.clicked[4];
        this.clicked[4] = true;
        if(this.clicked[this.quizs[this.quizid].correct] == true){
           this.rate++;
           this.$store.commit('increment');
        }
        this.dialog = true;
    }
  },

  computed: {
    wpt () { return this.$store.state.wpt }
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
        if (this.count >= 10) {
          this.result = true;
        }
      }
    }
  }
}
</script>
