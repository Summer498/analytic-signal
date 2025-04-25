# 波形可視化と解析信号の視覚表現

https://summer498.github.io/analytic-signal/

<image width="45%" src="image1.png">
<image width="45%" src="image2.png">


このプロジェクトでは、ブラウザ上で入力音声の波形を取得し、  
その**解析信号（analytic signal）**を生成して、**複素数平面上に可視化**します。

---

## 🔍 解析信号（Analytic Signal）とは？

解析信号とは、元の実数信号から得られる**複素数値信号**であり、  
時間領域信号の**振幅包絡や瞬時位相**を取り出すために使われます。

ある実数信号 $x(t)$ に対して、その解析信号 $z(t)$ は以下の形で定義されます：

$$
z(t) = x(t) + i \cdot \mathcal{H}[x(t)]
$$

ここで $\mathcal{H}[x(t)]$ は **ヒルベルト変換（Hilbert Transform）**です。

解析信号の性質：

- **実部：** 元の信号そのもの
- **虚部：** 元信号のヒルベルト変換（＝90度位相シフトされた信号）
- **絶対値：** 瞬時振幅 $|z(t)|$
- **偏角（角度）：** 瞬時位相 $\arg z(t)$

---

## 🔁 ヒルベルト変換とは？

ヒルベルト変換は、信号に対して**すべての周波数成分を $-90^\circ$ 位相シフト**させる変換です。  
時間領域での畳み込みとしても定義されますが、実際には周波数領域で効率よく行うのが一般的です。

### 周波数領域での定義：

1. 信号 $x(t)$ をフーリエ変換して $X(f)$ を得る
2. 周波数領域で以下のようにフィルタをかける：

$$
H(f) =
\begin{cases}
1 & (f = 0) \\\\
2 & (f > 0) \\\\
0 & (f < 0)
\end{cases}
$$

3. $X(f) \cdot H(f)$ に対して逆フーリエ変換することで、$z(t)$ を得る

---

## 🧭 この可視化が意味するもの

- **正弦波 → 完璧な円**  
- **複数の周波数 → 複雑なスパイラル構造**
- **振幅変調（AM） → 回転半径が変化**
- **周波数変調（FM） → 回転速度が変化**

これにより、**時間波形では見えなかった信号の構造**を、  
**幾何学的な軌跡として可視化**できます。

---

## ⚙ 実装上のポイント

- `getDisplayMedia({ audio: true })` によって音声入力を取得
- `AnalyserNode.getFloatTimeDomainData()` によって時間波形を取得
- 外部ライブラリ（または自作関数）で **FFT → ヒルベルト変換 → IFFT**
- キャンバス上で **Re vs. Im** を複素平面上に描画

---

## 📦 参考文献・資料

- [Bracewell, R. "The Fourier Transform and Its Applications"](https://web.stanford.edu/class/ee261/)
- Wikipedia: [Analytic signal](https://en.wikipedia.org/wiki/Analytic_signal)
- Wikipedia: [Hilbert transform](https://en.wikipedia.org/wiki/Hilbert_transform)

---

## 🗂 ディレクトリ構成（例）

