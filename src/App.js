import React, {Component} from 'react';
import {
    Layout,
    Skeleton,
    Descriptions,
    Divider,
    notification,
    List,
    Tag,
    Avatar,
    Row,
    Col,
    Statistic,
    Button,
    Modal,
    ConfigProvider,
    Input,
    Rate,
    message, Form, InputNumber, Radio
} from "antd";

import {WaterWave, Pie} from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import SelectAccount from "./component/SelectAccount"
import BigNumber from "bignumber.js"
import serojs from "serojs"

import "./App.css"
import copy from "copy-text-to-clipboard";
import QRCode from "qrcode";
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import Language from "./Lang"
import identicon from "identicon.js"
import Contract from "./component/contract"
// import popup from 'popup-js-sdk'
import seropp from 'sero-pp'
import logo from "./logo.png"

let ct = new Contract();
let Lang = new Language();
const {Header, Content, Footer} = Layout;

let contractAddress = ct.address;
let ABI = ct.abi;

let contract = serojs.callContract(ABI, contractAddress);

let decimal = new BigNumber(10).pow(18);
const {Countdown} = Statistic;

let dapp = {
    name: "HAPPYCB",
    contractAddress: "3j1fxFVHWxWthRDBrStMLrfastb8V7HnmC4ywu8ZEfiQBZiq74MWFhdHHF1FBjd9qQ8J3HXFDfZtebCEo78Adxx2",
    github: "https://github.com/hsgoldoss/happycb-popup",
    author: "HAPPYCB",
    url: document.location.href,
    logo: document.location.protocol + '//' + document.location.host + '/happycb-popup/logo.png'
};


const openNotificationWithIcon = (type, message, desc) => {
    notification[type]({
        message: message,
        description: <p style={{wordBreak: 'normal', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{desc}</p>,
        duration: null,
    });
};

const BuyAsnowForm = Form.create({name: 'form_in_modal1'})(
    // eslint-disable-next-line
    class extends React.Component {

        state = {
            asnow: 0,
            confirmLoading: false,
        }

        inputSero = (v, rate) => {
            let value = new BigNumber(v).dividedBy(rate).toFixed(2);
            this.setState({
                asnow: value
            })
        }

        render() {
            const {visible, rate, onCancel, onCreate, form} = this.props;
            const {getFieldDecorator} = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.buyAsnow.title}
                    // onCancel={onCancel}
                    onOk={() => {
                        this.setState({
                            confirmLoading: true
                        });
                        setTimeout(function () {
                            onCreate(function (res) {
                                that.setState({
                                    confirmLoading: res
                                });
                            });
                        }, 2)
                    }}
                    onCancel={
                        () => {
                            onCancel();
                            this.setState({
                                confirmLoading: false
                            });
                        }

                    }
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.buyAsnow.amount}>
                            {getFieldDecorator('Amount', {
                                rules: [{required: true, message: `Please Input Amount`}],
                            })(<InputNumber min={0} step={100} style={{width: '100%'}} allowClear
                                            onChange={(v) => this.inputSero(v, rate)}
                                            placeholder={Lang[that.props.lang].account.modal.buyAsnow.amountPlace}
                                            autoComplete="off"/>)}
                        </Form.Item>
                        <p>Rate: {<span style={{color: '#1DA57A'}}>1 HAPPYCB = {rate} FPRS</span>} , Exchange: {<strong
                            style={{color: 'rgb(216, 0, 38)'}}>{new BigNumber(this.state.asnow).toFixed(6)}</strong>} HAPPYCB</p>
                    </Form>
                </Modal>
            );
        }
    },
);

const InvestForm = Form.create({name: 'form_in_modal2'})(
    class extends React.Component {

        state = {
            confirmLoading: false,
            estimateReturn: 0,
            estimateLevel: 0,
            ticket: 0.000000,
            amount: 0.000000,
            total: 0.000000,
            ticketSero: 0.000000,
            ticketAsnow: 0.000000,
        }

        staticTotal() {
            let that = this;
            setTimeout(function () {
                let rate = that.props.rate;
                let times = that.props.times;
                let ticket = new BigNumber(that.state.ticketSero);
                let total = new BigNumber(that.state.amount);
                let ticketAsnow = new BigNumber(that.state.amount).dividedBy(10).dividedBy(rate);

                let estimateLevel = 3;
                if (times > 0) {
                    estimateLevel = times;
                } else {
                    if (parseFloat(that.state.amount) > 0 && parseFloat(that.state.amount) < 1000) {
                        estimateLevel = 3
                    } else if (parseFloat(that.state.amount) >= 1000 && parseFloat(that.state.amount) < 5000) {
                        estimateLevel = 4
                    } else if (parseFloat(that.state.amount) >= 5000) {
                        estimateLevel = 5
                    }
                }

                that.setState({
                    ticket: ticket.toFixed(6),
                    total: total.toFixed(6),
                    ticketAsnow: ticketAsnow.toFixed(6),
                    estimateLevel: estimateLevel
                })
            }, 10)
        }

        render() {
            const {visible, asnow, rate, sero, onCancel, onCreate, form, referId} = this.props;
            const {getFieldDecorator, setFieldsValue} = form;

            setTimeout(function () {
                if (referId && referId !== 0) {
                    setFieldsValue({"ReferId": referId});
                }
            }, 100)

            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.invest.title}
                    onCancel={onCancel}
                    onOk={() => {
                        this.setState({
                            confirmLoading: true
                        });
                        setTimeout(function () {
                            onCreate(function (res) {
                                that.setState({
                                    confirmLoading: res
                                });
                            });
                        }, 10)
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item label={Lang[that.props.lang].account.modal.invest.referId}>
                            {getFieldDecorator(`ReferId`, {
                                rules: [{required: true, message: `Please Input Refer Id`}],
                            })(<Input style={{width: '60%'}} disabled={!(!referId || referId === 0)}
                                      placeholder={referId ? referId : ""} autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item
                            label={`${Lang[that.props.lang].account.modal.invest.amount} (Available Balance: ${sero} FPRS)`}>
                            {getFieldDecorator('AmountSero', {
                                rules: [{required: true, message: `Please Input Amount! `}],
                            })(<InputNumber min={0} precision={6} max={parseFloat(sero)} step={100}
                                            style={{width: '60%'}} onChange={(v) => {
                                let ticketSero = new BigNumber(v).dividedBy(10).toFixed(6);
                                setFieldsValue({'TicketSero': ticketSero});
                                that.setState({amount: v, ticketSero: ticketSero});
                                that.staticTotal();
                            }} allowClear placeholder="0.000000" autoComplete="off"/>)}
                            <br/>FPRS ({Lang[that.props.lang].account.modal.invest.amountTips})
                        </Form.Item>
                        <Form.Item label={`${Lang[that.props.lang].account.modal.invest.ticket} (Amount x 10%)`}>
                            {getFieldDecorator('TicketSero', {
                                rules: [{required: true, message: 'Please input FPRS value!'}],
                            })(<InputNumber precision={6} disabled={true} min={0} max={parseFloat(sero)} step={100}
                                            style={{width: '40%'}} onChange={(v) => {
                                that.setState({ticketSero: v});
                                that.staticTotal();
                            }} allowClear placeholder="0.000000" autoComplete="off"/>)}
                            <br/> FPRS (1 HAPPYCB
                            = {rate} FPRS){Lang[that.props.lang].account.modal.invest.availableAsnow}: {<span
                            style={{color: '#1DA57A'}}>{asnow ? asnow : "0"}</span>}
                        </Form.Item>
                        <p>{Lang[that.props.lang].account.modal.invest.estimate}: <span
                            style={{color: '#1DA57A'}}>{that.state.amount}</span> (FPRS) x <span
                            style={{color: '#1DA57A'}}>{that.state.estimateLevel} </span>(Times) = <strong
                            style={{color: 'rgb(216, 0, 38)'}}>{new BigNumber(that.state.amount).multipliedBy(that.state.estimateLevel).toFixed(6)} </strong>FPRS
                        </p>

                        <p>{Lang[that.props.lang].account.modal.invest.total} : <strong
                            style={{color: 'rgb(216, 0, 38)'}}>{this.state.total}</strong> FPRS, <strong
                            style={{color: 'rgb(216, 0, 38)'}}>{this.state.ticketAsnow}</strong> HAPPYCB</p>
                    </Form>
                </Modal>
            );
        }
    },
);

const BuyTicketForm = Form.create({name: 'form_in_modal5'})(
    // eslint-disable-next-line
    class extends React.Component {

        state = {
            asnow: 0,
            confirmLoading: false,
        }

        render() {
            const {visible, asnow, onCancel, onCreate, form} = this.props;
            const {getFieldDecorator} = form;
            let that = this;
            return (
                <Modal
                    visible={visible}
                    title={Lang[that.props.lang].account.modal.buyTicket.title}
                    onCancel={onCancel}
                    onOk={() => {
                        this.setState({
                            confirmLoading: true
                        });
                        setTimeout(function () {
                            onCreate(function (res) {
                                that.setState({
                                    confirmLoading: res
                                });
                            });
                        }, 10)
                    }}
                    confirmLoading={this.state.confirmLoading}
                >
                    <Form layout="vertical">
                        <Form.Item
                            label={`${Lang[that.props.lang].account.modal.buyTicket.amount}(${Lang[that.props.lang].account.modal.buyTicket.availableAsnow}:${asnow})`}>
                            {getFieldDecorator('Amount', {
                                rules: [{required: true, message: `Please Input Amount`}],
                            })(<InputNumber min={0} max={parseFloat(asnow)} step={100} precision={5}
                                            style={{width: '100%'}} allowClear
                                            placeholder={Lang[that.props.lang].account.modal.buyTicket.amountPlace}
                                            autoComplete="off"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

class ContentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            showAccountSelect: false,
            showDeposit: false,
            showBuyAsnow: false,
            showBuyTicket: false,
            showInvest: false,
            showShareProfit: false,
            showWithdraw: false,

            modal1Visible: false,

            currentAccount: {},
            balanceSero: 0,
            balanceAsnow: 0,

            ct_balance_asnow: 0,
            ct_rate: 0,
            ct_id: 0,
            ct_details: {},

            lang: "zh_CN",
        }
    }

    componentWillMount() {
        let lang = localStorage.getItem("lang");
        if (!lang) {
            lang = "zh_CN";
            localStorage.setItem("lang", "zh_CN");
        }
        this.setState({
            lang: lang,
        })
    }

    componentDidMount() {
        let that = this;
        seropp.init(dapp, function (res) {
            console.log("res:::",res);
            if(res){
                that.showSelectAccount();
                if (!that.state.showAccountSelect) {
                    setTimeout(function () {
                        that.getDetail();
                        // that.getAsnowBalances();
                        that.getRate();
                        that.getContractSeroBalance();

                    }, 3000)
                }

                setInterval(function () {
                    that.getDetail();
                    // that.getAsnowBalances();
                    that.getRate();
                    that.getContractSeroBalance();
                    if (that.state.currentAccount.PK) {
                        that.getAccount(that.state.currentAccount.PK)
                    }
                }, 60 * 1000)
            }
        });
    }

    showSelectAccount() {

        if (!this.state.currentAccount.PK) {
            let pk = localStorage.getItem("accountPk");
            if (pk) {
                this.getAccount(pk)
                this.setState({
                    loading: false
                })
            } else {
                this.setState({
                    showAccountSelect: true
                })
            }
        }
    }

    showDeposit() {

        this.setState({
            showDeposit: true
        })

        let canvas = document.getElementById('qrImg')
        QRCode.toCanvas(canvas, this.state.currentAccount.MainPKr, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }

    selectAccount = ac => {
        this.setState({
            currentAccount: ac,
            showAccountSelect: false,
            loading: false
        });
        localStorage.setItem("accountPk", ac.PK);
        window.location.reload();

    }

    hiddenAccount = () => {
        this.setState({
            showAccountSelect: false,
        });
    }

    onChange = checked => {
        this.setState({loading: !checked});
    };

    getContractSeroBalance() {
        let that = this;
        that.callMethod("balanceOfSero", [], function (res) {
            if (res) {
                that.setState({
                    ct_balanceOfSero: new BigNumber(res, 10).dividedBy(decimal).toFixed(6),
                })
            }
        })
    }

    //pullup
    getAccount(pk) {
        let that = this;
        seropp.getAccountDetail(pk, function (currentAccount) {
            let balanceSero = 0;
            let balanceAsnow = 0;
            let balanceObj = currentAccount.Balance;
            balanceObj.forEach(function (value, currency) {
                if (currency === 'FPRS') {
                    balanceSero = new BigNumber(value).dividedBy(decimal).toFixed(6);
                } else if (currency === 'HAPPYCB') {
                    balanceAsnow = new BigNumber(value).dividedBy(decimal).toFixed(6);
                }
            });

            let data = new identicon(pk, 200).toString();
            currentAccount["avatar"] = "data:image/png;base64," + data;
            that.setState({
                currentAccount: currentAccount,
                balanceSero: balanceSero,
                balanceAsnow: balanceAsnow
            });
        });
    }


    //=== contract

    getDetail() {
        let that = this;
        let res = that.callMethod("details", [], function (res) {
            let detail = {
                referId: "",
                largeAreaId: "",
                largeAreaTotal: new BigNumber("0").dividedBy(decimal).toFixed(6),
                amount: new BigNumber("0").dividedBy(decimal).toFixed(6),
                returnAmount: new BigNumber("0").dividedBy(decimal).toFixed(6),
                achievement: new BigNumber("0").dividedBy(decimal).toFixed(6),
                recommendNum: parseInt(new BigNumber("0").toString(10)),
                profitLevel: parseInt(new BigNumber("0").toString(10)),
                value: new BigNumber("0").dividedBy(decimal).toFixed(6),
                star: parseInt(new BigNumber("0").toString(10)),
                isKing: false,
            }
            if (res !== "0x0") {
                if(res){
                    let data = res;
                    detail = {
                        referId: data[0] == 'JFVVW2ITNSJHF' ? "" : data[0],
                        largeAreaId: data[1] == 'JFVVW2ITNSJHF' ? "" : data[1],
                        largeAreaTotal: new BigNumber(data[2]).dividedBy(decimal).toFixed(6),
                        amount: new BigNumber(data[3]).dividedBy(decimal).toFixed(6),
                        returnAmount: new BigNumber(data[4]).dividedBy(decimal).toFixed(6),
                        achievement: new BigNumber(data[5]).dividedBy(decimal).toFixed(6),
                        recommendNum: parseInt(new BigNumber(data[6]).toString(10)),
                        profitLevel: parseInt(new BigNumber(data[7]).toString(10)),
                        value: new BigNumber(data[8]).dividedBy(decimal).toFixed(6),
                        star: parseInt(new BigNumber(data[9]).toString(10)),
                        isKing: data[10],
                    }
                }

            }
            that.callMethod("balanceOfAsnow", [], function (balanceOfAsnow) {
                detail["asnowBalances"] = new BigNumber(balanceOfAsnow).dividedBy(decimal).toFixed(6);
                that.callMethod("id", [], function (id) {
                    detail["id"] = (id == "JFVVW2ITNSJHF" ? "" : id);
                    that.callMethod("detailsOfIncome", [], function (detailsOfIncome) {
                        detail["detailsOfIncome"] = detailsOfIncome;
                        that.callMethod("calcuStaticProfit", [], function (calcuStaticProfit) {
                            if (calcuStaticProfit === '0x') {
                                calcuStaticProfit = "0";
                            }
                            detail["dayProfit"] = new BigNumber(calcuStaticProfit).dividedBy(decimal).toFixed(6);

                            that.setState({
                                ct_details: detail
                            })
                        });

                    });
                });
            });


        });

    }

    getRate() {
        let that = this;
        that.callMethod("conversionRate", [], function (res) {
            if (res && res.length > 0) {
                let asnow = new BigNumber(res[0]);
                let sero = new BigNumber(res[1])
                let point = asnow.dividedBy(sero).toFixed(2);
                that.setState({ct_rate: point});
            }
        });
    }

    callMethod(_method, args, callback) {

        let packData = contract.packData(_method, args);
        let callParams = {
            from: this.state.currentAccount.MainPKr,
            to: contractAddress,
            data: packData
        };

        seropp.call(callParams, function (callData,error) {
            if(error){
                console.log("error::",error);
            }else{
                let res = contract.unPackData(_method, callData);
                callback(res);
            }
        });
    }

    executeMethod(_method, args, value, cy, password, callback) {
        let that = this;

        let packData = contract.packData(_method, args);
        let executeData = {
            from: that.state.currentAccount.PK,
            to: contractAddress,
            value: "0x" + value,//FPRS
            data: packData,
            gas_price: "0x" + new BigNumber("1000000000").toString(16),
            cy: cy,
        };
        let estimateParam = {
            from: that.state.currentAccount.MainPKr,
            to: contractAddress,
            value: "0x" + value,//FPRS
            data: packData,
            gas_price: "0x" + new BigNumber("1000000000").toString(16),
            cy: cy,
        };
        // executeData["gas"] = pullup.sero.estimateGas(estimateParam);
        seropp.estimateGas(estimateParam, function (gas,error) {
            if(error){
                message.error(error);
            }else{
                executeData["gas"] = gas;
                seropp.executeContract(executeData, function (res) {
                    callback(res);
                });
            }
        });
    }


    handleCancel = () => {
        this.setState({
            showDeposit: false
        })
    }

    //====  buyAsnow begin
    handleBuyAsnowCancel = () => {
        this.setState({showBuyAsnow: false});
    };

    handleBuyAsnowCreate = (cb) => {
        let that = this;
        const {form} = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                if (cb) {
                    cb(false)
                }
                return;
            }
            let amount = form.getFieldValue("Amount");
            try {
                this.executeMethod("buyAsnow", [], new BigNumber(amount).multipliedBy(decimal).toString(16), "FPRS", '', function (res) {
                    if (res) {
                        form.resetFields();
                        that.setState({showBuyAsnow: false});
                        setTimeout(function () {
                            openNotificationWithIcon('success', 'Successful', `${Lang[that.state.lang].toast.tx}${res}`)
                        }, 3000)
                    }
                    if (cb) {
                        cb(false)
                    }
                });
            } catch (err) {
                if (err) {
                    message.error(err.message);
                } else {
                    message.error("request FPRS Node error:[" + err.message + "]");
                }
                if (cb) {
                    cb(false)
                }
            }

        });
    };

    saveBuyAsnowFormRef = formRef => {
        this.formRef = formRef;
    };
    //====  buyAsnow end

    //====  Invest begin
    handleInvestCancel = () => {
        this.setState({showInvest: false});
    };

    handleInvestCreate = (cb) => {
        let that = this;
        const {form} = this.formRef2.props;
        form.validateFields((err, values) => {
            if (err) {
                if (cb) {
                    cb(false)
                }
                return;
            }
            let amountSero = form.getFieldValue("AmountSero");
            // let ticketSero=form.getFieldValue("TicketSero");
            let referId = form.getFieldValue("ReferId");
            let password = form.getFieldValue("Password");

            let ticketAsnow = new BigNumber(amountSero).dividedBy(10).dividedBy(that.state.ct_rate).toFixed(6);

            if (that.state.ct_details.referId) {
                referId = that.state.ct_details.referId;
            }
            if (new BigNumber(amountSero).comparedTo(new BigNumber(this.state.balanceSero)) > 0) {
                if (cb) {
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessAmount);
            } else if (new BigNumber(ticketAsnow).comparedTo(new BigNumber(this.state.ct_details.asnowBalances)) > 0) {
                if (cb) {
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessTicket);
            } else if (parseFloat(amountSero) < 100) {
                if (cb) {
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.minInvest);
            } else {
                try {
                    this.executeMethod("invest", [referId], new BigNumber(amountSero).multipliedBy(decimal).toString(16), "FPRS", password, function (res) {
                        if (res) {
                            form.resetFields();
                            that.setState({showInvest: false});
                            setTimeout(function () {
                                openNotificationWithIcon('success', 'Successful', `${Lang[that.state.lang].toast.tx}${res}`)
                            }, 3000)
                        }
                        if (cb) {
                            cb(false)
                        }
                    });
                } catch (err) {
                    if (err) {
                        message.error(err.message);
                    } else {
                        message.error("request FPRS Node error:[" + err.message + "]");
                    }
                    if (cb) {
                        cb(false)
                    }
                }
            }
        });
    };

    calcuPrincipalProfit = (sero, cb) => {
        if (sero) {
            let seroHex = "0x" + new BigNumber(sero).multipliedBy(decimal).toString(16);
            this.callMethod("calcuPrincipalProfit", [seroHex], function (res) {
                if (cb) {
                    cb(res);
                }
            })
        }
    }

    saveInvestFormRef = formRef => {
        this.formRef2 = formRef;
    };

    //====  Invest end

    shareProfit() {
        let that = this;
        try {
            this.executeMethod("triggerStaticProfit", [], "0", "FPRS", '', function (res) {
                if (res) {
                    openNotificationWithIcon('success', 'Successful', `${Lang[that.state.lang].toast.tx}${res}`)
                } else {
                    if (res.error) {
                        message.error(res.error.message);
                    } else {
                        message.error("request FPRS Node error:[" + res + "]");
                    }
                }
            });
        } catch (err) {
            if (err) {
                message.error(err.message);
            } else {
                message.error("request FPRS Node error:[" + err.message + "]");
            }
        }

    }

    withdraw() {
        let that = this;
        try {
            this.executeMethod("withdrawBalance", [], "0", "FPRS", '', function (res) {
                if (res) {
                    openNotificationWithIcon('success', 'Successful', `${Lang[that.state.lang].toast.tx}${res}`)
                } else {
                    if (res.error) {
                        message.error(res.error.message);
                    } else {
                        message.error("request FPRS Node error:[" + res + "]");
                    }
                }
            });
        } catch (err) {
            if (err) {
                message.error(err.message);
            } else {
                message.error("request FPRS Node error:[" + err.message + "]");
            }
        }
    }


    //==== Buy Ticket begin

    handleBuyTicketCancel = () => {
        this.setState({showBuyTicket: false});
    };

    handleBuyTicketCreate = (cb) => {
        let that = this;
        const {form} = this.formRef5.props;
        form.validateFields((err, values) => {
            if (err) {
                if (cb) {
                    cb(false)
                }
                return;
            }

            let amount = form.getFieldValue("Amount");
            if (new BigNumber(amount).comparedTo(new BigNumber(that.state.balanceAsnow)) > 0) {
                if (cb) {
                    cb(false)
                }
                message.warn(Lang[that.state.lang].toast.lessAsnow);
            } else {
                try {
                    this.executeMethod("paymentAsnow", [], new BigNumber(amount).multipliedBy(decimal).toString(16), "HAPPYCB", '', function (res) {
                        if (res) {
                            form.resetFields();
                            that.setState({showBuyTicket: false});
                            setTimeout(function () {
                                openNotificationWithIcon('success', 'Successful', `${Lang[that.state.lang].toast.tx}${res}`)
                            }, 3000)
                        }
                        if (cb) {
                            cb(false)
                        }
                    });
                } catch (err) {
                    if (err) {
                        message.error(err.message);
                    } else {
                        message.error("request FPRS Node error:[" + err.message + "]");
                    }
                    if (cb) {
                        cb(false)
                    }
                }
            }
        });
    };

    saveBuyTicketFormRef = formRef => {
        this.formRef5 = formRef;
    };


    //==== Buy Ticket end

    render() {
        const {loading, showAccountSelect, currentAccount} = this.state;
        let accountName = currentAccount.PK;
        let that = this;
        let staticReward = that.state.ct_details.detailsOfIncome ? new BigNumber(that.state.ct_details.detailsOfIncome[0]).dividedBy(decimal).toFixed(2) : 0;
        let recommendReward = that.state.ct_details.detailsOfIncome ? new BigNumber(that.state.ct_details.detailsOfIncome[1]).dividedBy(decimal).toFixed(2) : 0;
        let nobilityReward = that.state.ct_details.detailsOfIncome ? new BigNumber(that.state.ct_details.detailsOfIncome[2]).dividedBy(decimal).toFixed(2) : 0;
        let vipReward = that.state.ct_details.detailsOfIncome ? new BigNumber(that.state.ct_details.detailsOfIncome[3]).dividedBy(decimal).toFixed(2) : 0;
        // let currentIncome = that.state.ct_details.detailsOfIncome?new BigNumber(that.state.ct_details.detailsOfIncome[4]).dividedBy(decimal).toFixed(2):0;
        let staticTimestamp = that.state.ct_details.detailsOfIncome ? that.state.ct_details.detailsOfIncome[5] : 0;

        const salesPieData = [
            {
                x: Lang[this.state.lang].account.title.staticReward,
                y: parseFloat(staticReward),
            },
            {
                x: Lang[this.state.lang].account.title.recommendReward,
                y: parseFloat(recommendReward),
            },
            {
                x: Lang[this.state.lang].account.title.nobilityReward,
                y: parseFloat(nobilityReward),
            },
            {
                x: Lang[this.state.lang].account.title.vipReward,
                y: parseFloat(vipReward),
            },

        ];

        const showChart = parseFloat(staticReward) > 0 || parseFloat(recommendReward) > 0 || parseFloat(nobilityReward) > 0 || parseFloat(vipReward) > 0

        const countDown = nextShareTime();
        let totalReturnDay = this.state.ct_balanceOfSero ? new BigNumber(this.state.ct_balanceOfSero).dividedBy(30).toFixed(6) : "0";
        let returnPercent = 0;
        console.log("this.state.ct_details.returnAmount:",this.state.ct_details.returnAmount);
        if (this.state.ct_details.returnAmount && parseFloat(this.state.ct_details.returnAmount) > 0) {
            let a = parseFloat(this.state.ct_details.returnAmount);
            let b = new BigNumber(this.state.ct_details.amount).multipliedBy(this.state.ct_details.profitLevel).toString(10);
            returnPercent = (a * 100 / parseFloat(b)).toFixed(2);
        }

        let showCountDown = new Date(staticTimestamp * 1000).getUTCDate() === parseInt(new Date().getUTCDate());
        return (
            <div className="App" style={{marginTop:'80px'}}>
                <Content style={{padding: '0 8px'}}>
                    <div style={{background: '#fff', padding: 5, minHeight: document.body.clientHeight}}>

                        <List itemLayout="vertical" size="large" rowKey="1">
                            <List.Item>
                                <Skeleton loading={loading} avatar>
                                    <Descriptions title={
                                        <h1>{Lang[this.state.lang].account.title.utxo} <Button size="small"
                                                                                               onClick={() => {
                                                                                                   this.setState({
                                                                                                       showAccountSelect: true
                                                                                                   })
                                                                                               }}>{Lang[this.state.lang].account.title.swith}</Button>
                                        </h1>}/>
                                    <Row>
                                        <Col span={24}>
                                            <List.Item.Meta
                                                avatar={<p><Avatar shape="square" size={64}
                                                                   src={currentAccount.avatar}/></p>}
                                                title={
                                                    <small>{accountName ? accountName.slice(0, 10) + "..."+accountName.slice(-10) : ""}{this.state.ct_details.isKing ?
                                                        <Tag color="gold">VIP</Tag> : ""}</small>
                                                }
                                                description={<Rate count={4}
                                                                   value={this.state.ct_details.star ? this.state.ct_details.star : 0}
                                                                   disabled/>}
                                            />
                                        </Col>

                                    </Row>
                                    <Row style={{textAlign: 'center'}}>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.balanceSero}
                                                       value={this.state.balanceSero} precision={6}/>
                                            <Button style={{marginTop: 16}} type="primary" onClick={() => {
                                                this.showDeposit()
                                            }}>{Lang[this.state.lang].account.button.deposit}</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.balanceAsnow}
                                                       value={this.state.balanceAsnow} precision={6}/>
                                            <Button style={{marginTop: 16}} type="primary" onClick={() => {
                                                this.setState({showBuyAsnow: true})
                                            }}>{Lang[this.state.lang].account.button.buy}</Button>
                                        </Col>
                                    </Row>

                                </Skeleton>
                            </List.Item>

                            <List.Item>
                                <Skeleton loading={loading}>
                                    <Descriptions title={<h1>{Lang[this.state.lang].account.title.contract}</h1>}/>

                                    <Row style={{textAlign: 'center'}}>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.estimatedTotal}
                                                       value={new BigNumber(this.state.ct_details.amount ? this.state.ct_details.amount : 0).multipliedBy(this.state.ct_details.profitLevel ? this.state.ct_details.profitLevel : 0).toFixed(6)}
                                                       precision={6}/>
                                            <Button style={{marginTop: 16}} type="primary" onClick={() => {
                                                this.setState({showInvest: true})
                                            }}>{Lang[this.state.lang].account.button.invest}</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.ticket}
                                                       value={new BigNumber(this.state.ct_details.asnowBalances ? this.state.ct_details.asnowBalances : 0).toFixed(6)}
                                                       precision={6}/>
                                            <Button style={{marginTop: 16}} type="primary" onClick={() => {
                                                this.setState({showBuyTicket: true})
                                            }}>{Lang[this.state.lang].account.button.buyTicket}</Button>
                                        </Col>

                                    </Row>
                                    <Row style={{textAlign: 'center'}}>
                                        <p/>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.staticIncome}
                                                       value={this.state.ct_details.dayProfit} precision={6}/>
                                            {
                                                showCountDown ?
                                                    <Countdown style={{marginTop: 14}} title="" format="HH:mm:ss"
                                                               value={parseFloat(countDown)} onFinish={() => {
                                                        this.getDetail()
                                                    }}/> : <Button style={{marginTop: 16}} type="primary"
                                                                   disabled={showCountDown} onClick={() => {
                                                        this.shareProfit()
                                                    }}>{Lang[this.state.lang].account.button.trigger}</Button>
                                            }
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.withdraw}
                                                       value={new BigNumber(this.state.ct_details.value ? this.state.ct_details.value : 0).toFixed(6)}
                                                       precision={6}/>
                                            <Button style={{marginTop: 16}} disabled={new BigNumber(this.state.ct_details.value ? this.state.ct_details.value : 0).comparedTo(0) < 1} type="primary" onClick={() => {
                                                this.withdraw()
                                            }}>{Lang[this.state.lang].account.button.withdraw}</Button>
                                        </Col>
                                    </Row>
                                    {
                                        showChart ?
                                            <Row style={{textAlign: 'center'}}>
                                                <Col span={24} style={{textAlign: 'center'}}>
                                                    <div>
                                                        {returnPercent > 0 ? <WaterWave height={234}
                                                                                        title={Lang[this.state.lang].account.title.totalReturn}
                                                                                        percent={returnPercent}/> :
                                                            <WaterWave height={234}
                                                                       title={Lang[this.state.lang].account.title.totalReturn}
                                                                       percent={0}/>}
                                                    </div>
                                                </Col>
                                                <Col span={24} style={{textAlign: 'left'}}>
                                                    <Pie
                                                        hasLegend
                                                        animate
                                                        title={Lang[this.state.lang].account.title.totalReturn}
                                                        subTitle={Lang[this.state.lang].account.title.totalReturn}
                                                        total={() => (
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: salesPieData.reduce((pre, now) => now.y + pre, 0),
                                                                }}
                                                            />
                                                        )}
                                                        data={salesPieData}
                                                        valueFormat={val => <span
                                                            dangerouslySetInnerHTML={{__html: val}}/>}
                                                        height={248}
                                                    />
                                                </Col>
                                            </Row> : ""
                                    }
                                    <Divider dashed={true}/>
                                    <Row style={{textAlign: 'center'}}>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.totalReturnDay}
                                                       value={totalReturnDay} precision={6}/>
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.dayIncome}
                                                       value={this.state.ct_details.dayProfit&&parseFloat(totalReturnDay)>0 ? new BigNumber(this.state.ct_details.dayProfit).multipliedBy(100).dividedBy(totalReturnDay).toFixed(2) : "0"}
                                                       suffix={"%"}/>
                                        </Col>

                                    </Row>
                                    <Row style={{textAlign: 'center'}}>
                                        <p/>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.areaTotal}
                                                       value={this.state.ct_details.largeAreaTotal} precision={6}/>
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title={Lang[this.state.lang].account.title.areaOtherTotal}
                                                       value={new BigNumber(this.state.ct_details.achievement).minus(new BigNumber(this.state.ct_details.largeAreaTotal)).toFixed(6)}
                                                       precision={6}/>
                                        </Col>
                                    </Row>
                                </Skeleton>
                            </List.Item>

                            <List.Item>
                                <Skeleton loading={loading}>
                                    <Descriptions title={<h1>{Lang[this.state.lang].project.title}</h1>}>
                                        <Descriptions.Item label={Lang[this.state.lang].project.contractAddress}>
                                            <small>{contractAddress}</small>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <Row>
                                        <Col span={8}>
                                            <Statistic title={Lang[this.state.lang].project.rate}
                                                       value={this.state.ct_rate} precision={2}
                                                       valueStyle={{color: '#3f8600'}}/>
                                        </Col>
                                    </Row>
                                    <Divider dashed={true}/>
                                    <Descriptions title={Lang[this.state.lang].account.title.investDetail}>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.id}>{this.state.ct_details.id}</Descriptions.Item>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.referId}>{this.state.ct_details.referId}</Descriptions.Item>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.areaId}>{this.state.ct_details.largeAreaId}</Descriptions.Item>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.totalInvest}>{this.state.ct_details.amount}</Descriptions.Item>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.profitLevel}>{this.state.ct_details.profitLevel}</Descriptions.Item>
                                        <Descriptions.Item
                                            label={Lang[this.state.lang].account.title.latestTime}>{convertUTCDate(staticTimestamp)}</Descriptions.Item>
                                    </Descriptions>
                                </Skeleton>
                            </List.Item>

                        </List>
                    </div>
                </Content>

                <SelectAccount visible={showAccountSelect} selectAccount={this.selectAccount}
                               hiddenAccount={this.hiddenAccount}/>

                <Modal
                    title={Lang[this.state.lang].account.modal.deposit.title}
                    visible={this.state.showDeposit}
                    onCancel={this.handleCancel}
                    footer={null}
                    getContainer={false}
                >
                    <div style={{textAlign: "center"}}>
                        <canvas id="qrImg"></canvas>
                        <p style={{wordBreak: 'normal', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                            <small>{this.state.currentAccount.MainPKr}</small></p>
                        <Button className='copyTxt' onClick={() => {
                            copy(this.state.currentAccount.MainPKr);
                            message.success('Copy to clipboard successfully');
                        }}>{Lang[this.state.lang].account.modal.deposit.copy}</Button>
                    </div>
                </Modal>

                <BuyAsnowForm
                    wrappedComponentRef={this.saveBuyAsnowFormRef}
                    visible={this.state.showBuyAsnow}
                    onCancel={this.handleBuyAsnowCancel}
                    onCreate={this.handleBuyAsnowCreate}
                    rate={this.state.ct_rate}
                    lang={this.state.lang}
                />

                <InvestForm
                    wrappedComponentRef={this.saveInvestFormRef}
                    visible={this.state.showInvest}
                    onCancel={this.handleInvestCancel}
                    onCreate={this.handleInvestCreate}
                    sero={this.state.balanceSero}
                    asnow={this.state.ct_details.asnowBalances}
                    calcuPrincipalProfit={this.calcuPrincipalProfit}
                    rate={this.state.ct_rate}
                    lang={this.state.lang}
                    times={this.state.ct_details.profitLevel}
                    referId={this.state.ct_details.referId}
                />

                <BuyTicketForm
                    wrappedComponentRef={this.saveBuyTicketFormRef}
                    visible={this.state.showBuyTicket}
                    onCancel={this.handleBuyTicketCancel}
                    onCreate={this.handleBuyTicketCreate}
                    asnow={this.state.balanceAsnow}
                    lang={this.state.lang}
                />

            </div>
        );
    }
}


class App extends Component {
    constructor() {
        super();
        this.state = {
            locale: zhCN,
        };
    }

    componentWillMount() {
        let lang = localStorage.getItem("lang");
        let locale = zhCN;
        if (lang) {
            if (lang === "zh_CN") {
                locale = zhCN;
            } else if (lang === "en_US") {
                locale = enUS;
            }
        } else {
            locale = zhCN;
            localStorage.setItem("lang", "zh_CN");
        }

        this.setState({
            locale: locale
        })
    }

    changeLocale = e => {
        const localeValue = e.target.value;
        this.setState({locale: localeValue});
        if (localeValue.locale === "en") {
            localStorage.setItem("lang", "en_US");
        } else if (localeValue.locale === "zh-cn") {
            localStorage.setItem("lang", "zh_CN");
        }
    };

    render() {
        const {locale} = this.state;
        return (
            <div className="App">
                <Layout className="layout">
                    <Header className="header">
                        <div className="logo"><img src={logo}/></div>
                        <div className="change-locale">
                            <Radio.Group value={locale} onChange={this.changeLocale}>
                                <Radio.Button key="en" value={enUS}>
                                    English
                                </Radio.Button>
                                <Radio.Button key="cn" value={zhCN}>
                                    中文
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </Header>

                    <ConfigProvider locale={locale}>
                        <ContentPage key={locale ? locale.locale : 'en'}/>
                    </ConfigProvider>
                    <Footer style={{textAlign: 'center'}}/>
                </Layout>
            </div>
        );
    }
}

function convertUTCDate(dateTimestamp) {
    if (dateTimestamp && dateTimestamp > 0) {
        let cDate = new Date(dateTimestamp * 1000);
        return appendZero(cDate.getMonth() + 1) + "/" + appendZero(cDate.getDate()) + " " + appendZero(cDate.getHours()) + ":" + appendZero(cDate.getMinutes());
    }
    return ""
}

function nextShareTime() {
    let d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    let year = d.getUTCFullYear();
    let month = d.getUTCMonth();
    let day = d.getUTCDate();
    d = new Date(year, month, day, 0, 0, 0);

    let tz = new Date().getTimezoneOffset() / 60;
    return d.getTime() + (-tz) * 60 * 60 * 1000;
}

function appendZero(i) {
    i = i < 10 ? "0" + i : i;
    return i;
}

export default App;

