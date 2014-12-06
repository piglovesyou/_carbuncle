Carbuncle [![Build Status](https://travis-ci.org/piglovesyou/carbuncle.svg?branch=master)](https://travis-ci.org/piglovesyou/carbuncle)
===================

ウェブGUIテストを増やすツールです。/ Web GUI Test Builder.


<p align="center"><img width="600px" src="/assets/image/image.png" /></p>

Selenium テストには２つの問題があります。１つはテストを増やすのが大変なことです。コードが書ける方しか増やせませんし、Selenium Builder もコードを吐きますので結局コードを保守することになります。/ Selenium Testing has two problems. First it's hard to write tests for person who don't write code. Selenium Builder helps it though, it generates scripts so it's still hard for them to maintain.

２つめは捨てにくいことです。たくさんの時間をかけて増やしたGUI自動テストを簡単に捨てられますか？ もしためらいがあるなら、自動テストが UI 仕様改善の足かせになる可能性があります。UI テストは書きやすく、また捨てやすくなくてはなりません。/  Second, to abandon those scripts makes us pain because it took a lot of time to maintain. If so, it can bother us to decide UI spec changing. Thus, UI tests have to be easily written and easily abandoned.

Carbuncle はコードが書けない方でも短時間で自動テストを増やしてもらえ、削除など管理してもらえるアプリケーションです。/ Carbuncle is a tool that makes non-programmer build and manage automation tests.


必要なもの/Requirement
--
 
 - Node
 - node-webkit (nw command)
 - java
 - chromedriver


起動/Get it Move
--

```
$ npm install
$ NODE_ENV=production nw .
```


やること/TODO
--

まだぜんぜん使えません。/Still shit, it works though.

 - 永続化の方法をローカルとリモートで選べるように（jugglingdb?）
 - シナリオをブロックにし、他のシナリオの一部として使いまわせるように
 - 作成したシナリオを一覧、簡単に見つけられるように
 - CIからの使われ方も考える
 - キャプチャのファイル名を何とかしないと
 - node-webkit アプリのテストって一体どう書くのか
