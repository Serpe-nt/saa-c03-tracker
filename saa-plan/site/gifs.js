// DATA ONLY: South Park GIFs for the quiz results screen, by outcome ([GIPHY id, what happens in it]).
// ace = every answer right, pass = passed with some wrong, fail = below the bar (see outcome() in app.js).
// They are loaded from GIPHY's CDN (media.giphy.com, allowed by the CSP in server/main.go), never stored here.
// The id is the last part of a giphy.com/gifs/… address. Taken in turn, so add as many as you like; one that
// no longer loads simply leaves the results without a GIF.
// Chosen on 2026-10-17 by watching every candidate from GIPHY searches (the owner asked for the show's crazier,
// edgier moments, the more the better as long as they fit the outcome): big celebrations for an ace, shrugs and
// "whatever" for a pass, Kenny dying, meltdowns and vomit for a fail. Left out on purpose: nudity, sexual songs,
// slurs and ethnic caricatures.
window.GIFS = {
  ace: [
    ["EzfZewETfFN3nUfHIc", "Cartman: Sweet!"],
    ["1SD4lL2dG7Qe4", "Cartman: Respect my authoritah!"],
    ["V2qjQASrLwLuwpagjI", "Cartman, blissful: This is so awesome"],
    ["26BkMN3HYpLFLh2ik", "AWESOM-O, the awesome robot"],
    ["3oKIPErkMY4ZPH1K36", "Cartman dancing in front of a mariachi band"],
    ["l41m1TfBAOeP3sU6Y", "Randy and the dads break into a dance"],
    ["cZqUn4yiYjQb8bDXwO", "Randy dancing in the kitchen in his underwear"],
    ["3og0IKOlKpL6nRZaCs", "Kenny dancing"],
    ["l0HlLYbSY74nhfNgA", "Kenny: Woo hoo!"],
    ["3o6Ztp6SgDdzR0XD2w", "Kenny on stage: Yeah!"],
    ["26uf4erLHNdJCK8s8", "Stan: Yea! Yea! Yea!"],
    ["l0HlMHHjY1VzFcixG", "The whole school: Woo-hoo! Yippee! All right! Yay!"],
    ["26ufov3BtYI74EzhS", "The kids: Yay! Yay!"],
    ["3o6ZsVrLHTDH6Jc7AY", "The class: Yeah! Yeah!"],
    ["26ufkvk5skF6CJEoo", "The crowd: Yeahhh! Whooo! Yayyy!"],
    ["3o6ZtbKXRO0BNPgiwE", "The town: cheers and applause"],
    ["3ohze0DcMP6SIHfUwE", "A party-hat crowd going wild"]
  ],
  pass: [
    ["kvPIQBwSp6GKk", "Cartman: Whateva, I do what I want"],
    ["nPD15mADocUEM", "Cartman: Wuteva!"],
    ["GjHaw66kJsNxeBRv9B", "Cartman, resigned: Okay"],
    ["3Q35chD4bMtEePqr8A", "Mr. Mackey: M'kay"],
    ["p5TLPx39kEXQ7cD7lu", "Randy: They are good enough for you guys"],
    ["Z9zv5sdc7g6BH8tSbW", "Randy shrugging"],
    ["pqAXpsHpYwYZIwf1m9", "Stan: We kinda just don't care"],
    ["XtRPs0okKYM36", "Kyle: Whatever happens next, I'm going to embrace it with a totally positive attitude"],
    ["wxR9PtAvPlFeEa2hSD", "Kyle: If not, whatever, I'm cool"],
    ["l2SqiXzjlSCxG1Wpi", "The crowd, half-hearted: Alright!"]
  ],
  fail: [
    ["WieqsBQwFzOy4", "Stan and Kyle: Oh my God! They killed Kenny!"],
    ["VionqeepeWyJy", "Butters: Oh, my God! They killed Kenny!"],
    ["l3vQXqVUhHJJ5AW3e", "Kyle: Kenny, noooooo!"],
    ["l41YgCQS9TsHJJ5mg", "Kenny flattened on the road"],
    ["jqvaDnPkUro9a", "Cartman: Screw you guys, I'm going home"],
    ["3o6ZtdFjWBa6UPcn5u", "Cartman, furious: Screw you guys!"],
    ["XiGdBtlp1zLoEqO24z", "Cartman in the street: NOOOOOOOOOO!"],
    ["l0MYJdM3nCpBXwZUI", "Cartman sobbing hysterically"],
    ["kkEm7G8KUezK", "Cartman savouring the tears of unfathomable sadness"],
    ["fRxhKSRzSqlAbrd3EF", "Cartman: I got bullied again!"],
    ["vd7mMhHTjbHUsU7UxL", "Cartman tied to a pole, crying"],
    ["KqeAsPBxSbnyJfXrxu", "Cartman throwing up next to the toilet"],
    ["12tiQSHr16vrcA", "Stan throwing up in front of everyone"],
    ["UlQsbaUrTbtrkrYSqg", "A face covered in vomit"],
    ["3o6Ztb4V06UCffHBWE", "Stan and Kyle, grossed out: Ugh, dude. Agh, God!"],
    ["26gJy8JNlJIA4gQ1O", "Stan: This sucks!"],
    ["l41lNDIQgc9R8v7A4", "Butters crawling and crying"],
    ["xTiTnemOMkMyeOpYcg", "Butters bawling in a hospital bed"],
    ["sifwwmX2aGr0PGglKj", "Randy crying in the rain"]
  ]
};
