import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";


// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
//IndexPageメソッドがページコンポーネント
//このメソッドにはNextPage型の型注釈がついている(ページコンポーネントにおける型注釈という認識であってるかな?)
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
    const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく

    //useEffect関数: 第1引数が処理内容, 第2引数が処理を実行するタイミング指定
    // useEffect(() => {
    //   fetchImage().then((newImage) => {
    //     setImageUrl(newImage.url);
    //     setLoading(false);
    //   });
    // }, []);

    // ボタンをクリックしたときに画像を読み込む処理
    const handleClick = async () => {
        setLoading(true); // 読込中フラグを立てる
        const newImage = await fetchImage();
        setImageUrl(newImage.url); // 画像URLの状態を更新する
        setLoading(false); // 読込中フラグを倒す
    };
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                他のにゃんこも見る
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );
};
export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

type Image = {
    url: string;
};

//fetch: HTTPリクエストでリソースを取得するブラウザ標準のAPI    
//anyncキーワード: 非同期処理を行うことができる
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};

/*この時点でエラーを見つけてくれる, TypeScriptの利点
fetchImage().then((image) => {
    console.log(image.alt); // 存在しないプロパティを参照している
  });
*/