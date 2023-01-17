import { useState, useEffect,useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";


import {
  AppstoreOutlined,
  LoginOutlined,
  CoffeeOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);
  const { user } = state;
  
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };
  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
    <Item
      key="/"
      onClick={(e) => setCurrent(e.key)}
      icon={<AppstoreOutlined />}
    >
      <Link legacyBehavior href="/">
        <a>App</a>
      </Link>
    </Item>

    {user === null && (
      <>
        <Item
          key="/login"
          onClick={(e) => setCurrent(e.key)}
          icon={<LoginOutlined />}
        >
          <Link legacyBehavior href="/login">
            <a>Login</a>
          </Link>
        </Item>

        <Item
          key="/register"
          onClick={(e) => setCurrent(e.key)}
          icon={<UserAddOutlined />}
        >
          <Link legacyBehavior href="/register">
            <a>Register</a>
          </Link>
        </Item>
      </>
    )}

    {user !== null && (
      <SubMenu
        icon={<CoffeeOutlined />}
        title={user && user.firstName}
        className="float-end"
      >
        <Item onClick={logout} className="float-end">
          Logout
        </Item>
      </SubMenu>
    )}
  </Menu>
  );
};

export default TopNav;
