<template lang="pug">
  v-container(grid-list-md, text-xs-center)
    v-layout(row, wrap, justify-center)
      v-flex(xs12)
        v-card
          v-card-title.pl-5 問題 {{ quizid+1 }}
          v-card-text.pa-5 {{ quizs[quizid].question }}
      v-flex.py-0.ma-0(v-for="i in 4", :key="`option${i-1}`", xs6)
        v-card(:class="[ isCorrect(i-1) ? correctClass : (clicked[i-1] ? errorClass : defaultClass) ]")
          v-btn.pb-5.pt-4(block, flat, @click="debug(i-1)") {{ quizs[quizid].answer[i-1] }}
      v-dialog(v-model="dialog", width="800")
        v-flex(xs12)
          v-card.pa-0
            v-card-title.pl-4 正解は、 {{ quizs[quizid].answer[quizs[quizid].correct] }}
            v-card-text.py-5 {{ tips[quizid] }}
      v-flex(xs4)
        v-card.pa-0
          v-btn(block, flat, to="/") クイズをやめる
</template>

<script>
export default {
  data: () => {
    return {
      count: 0,
      dialog: false,
      clicked: [false, false, false, false, false],
      defaultClass: '',
      correctClass: 'light-green accent-3',
      errorClass: 'red darken-1',
      quizid: 0,
      quizs: [{question: "和歌山といえば何？", answer: ["みかん", "りんご", "玉ねぎ", "バナナ"], correct: 0},
              {question: "和歌山の公式キャラ？", answer: ["オカザエモン", "わかぱん", "ふなっし", "くまモン"], correct: 1}
             ],
      tips: ["和歌山はみかんの収穫量が日本で一番なんだって！！",
             "和歌山はみかんの収穫量が日本で一番なんだって！！",
            ]
    }
  },

  methods: {
    isCorrect(x){
        return (x == this.quizs[this.quizid].correct) && this.clicked[4]
    },
    debug(x){
        this.clicked[x] = !this.clicked[4];
        this.clicked[4] = true;
        this.dialog = true;
        this.count++;
        console.log(this.clicked[x]&&this.isCorrect(x));
    }
  },

  watch: {
    dialog: function(val) {
      if (!val) {
        var i;
        for (i = 0; i < 5; i++) {
          this.clicked[i] = false;
        } 
        this.quizid++;
      }
    }
  }
}
</script>
