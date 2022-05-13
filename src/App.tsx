import axios from "axios";
import { useEffect, useState } from "react";
import { encodeInp, loadImage } from "./utils";
import {
  Button,
  Cell,
  Dialog,
  Field,
  Flex,
  Loading,
  NoticeBar,
  Notify
} from "react-vant";
import "./styles.css";
import { Bell, Close } from "@react-vant/icons";

export default function App() {
  const host = "http://wildsky.cn:4040/";
  const [data, setData] = useState(null as any);
  const [userName, setUserName] = useState("");
  const [passWord, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const getCode = () => {
    setLoading(true);
    axios({
      method: "GET",
      url: host + "getCode"
    })
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((r) => {
        Notify.show("获取验证码失败，请点击验证码重新获取");
      });
  };
  useEffect(() => {
    getCode();
  }, []);
  const Ad = () => {
    return (
      <div>
        <div>
          <img
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "100%",
              maxWidth: "100%"
            }}
            src="https://stats.justsong.cn/api/github?username=class-undefined"
          />
        </div>
        <div style={{ textAlign: "center" }}>点个 star 再走？</div>
      </div>
    );
  };
  const cookies = data && data.cookies;
  const submit = () => {
    setLoading(true);
    axios({
      url: host + "postEvaluation",
      method: "POST",
      data: {
        cardId: userName,
        code,
        cookies: JSON.stringify(cookies),
        token: `${encodeInp(userName)}%%%${encodeInp(passWord)}`
      }
    })
      .then((r) => {
        console.log(r);
        const { success } = r.data as any;
        if (!success) throw new Error("失败了");
        return loadImage(
          "https://stats.justsong.cn/api/github?username=class-undefined"
        );
      })
      .then((r) => {
        setLoading(false);
        Dialog.confirm({
          title: "评教成功！",
          message: <Ad />,
          confirmButtonText: "好！",
          cancelButtonText: "白嫖了"
        })
          .then(() => {
            window.open("https://github.com/class-undefined", "_blank");
          })
          .catch((_) => {
            Notify.show("好可惜，你已错失良缘~");
          });
      })
      .catch((e) => {
        setLoading(false);
        Notify.show(e.message);
      });
  };
  const Code = (props: { width: string; height: string }) => {
    return (
      <div style={{ ...props }}>
        <img
          style={{
            width: "auto",
            height: "auto",
            maxHeight: "100%",
            maxWidth: "100%"
          }}
          onClick={() => getCode()}
          src={data && data.image}
          alt="验证码"
        />
      </div>
    );
  };
  return (
    <div className="App">
      <Cell.Group>
        <Field
          value={userName}
          onChange={(e) => setUserName(e)}
          label="学号"
          placeholder="请输入学号"
        />
        <Field
          value={passWord}
          onChange={(e) => setPassword(e)}
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
        <Field
          value={code}
          onChange={(e) => setCode(e)}
          label="验证码"
          placeholder="请输入验证码"
          rightIcon={<Code width="100px" height="25px" />}
        />
        <Button
          loading={loading}
          loadingText={"稍等片刻"}
          onClick={submit}
          type="primary"
          style={{ width: "100%" }}
        >
          一键评教
        </Button>
      </Cell.Group>

      {/* <NoticeBar style={{ alignItems: "center" }}>
        <div
          style={{ width: "100%", justifyContent: "center", display: "flex" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Loading type="ball" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              正在执行
            </div>
          </div>
        </div>
      </NoticeBar>
     */}
    </div>
  );
}
