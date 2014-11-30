Carbuncle
===================

ウェブGUI をテストするツールです。/ Web GUI Test Builder.

Selenium テストには２つの問題があります。１つはテストを増やすのが大変なこと。コードが書けないと増やせませんし、Selenium Builder もコードを吐きますので結局コードを保守することになります。２つめは捨てにくいことです。時間をかけて増やしたGUI自動テストや自社サービス用ページライブラリを簡単に捨てられますか？ もしそれが製品の UI の仕様変更の足かせになっているのだとしたら良くないことです。/ Selenium Testing has two problems. It is hard to build for person who don't write code. Selenium Builder helps it though, it generates scripts so it's still hard for them to maintain. Second, to abandon those scripts makes us pain even if we have to change the current UI because it took a lot of time.

Carbuncle はコードが書けない方でも短時間で自動テストを増やしてもらえるし、その時が来たら気兼ねなく捨てられるようにするツールです。/ Carbuncle is a tool that makes non-programmer build automation tests and enable us to throw those away if the time has come.


必要なもの/Requirement
--
 
 - Node
 - node-webkit (nw command)
 - java


起動/Get it Move
--

```
$ npm install
$ NODE_ENV=production nw .
```

