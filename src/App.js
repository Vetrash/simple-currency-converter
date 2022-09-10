import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [Currence, setCurrence] = useState({
    FirstCurrence: {
      value: '',
      code: 'USD',
    },
    SecondCurrence: {
      value: '',
      code: 'BYN',
    },
  });
  const [dataCurrence, setDataCurrence] = useState({
    Date: '',
    Valute: { },
  });

  const startCurrence = async () => {
    const request = await fetch('https://ipinfo.io/json?token=4c84835f9196cc');
    const ipInfo = await request.json();
    const { country } = ipInfo;
    const countryList = [
      { country: 'RU', currence: 'RUB' },
      { country: 'AU', currence: 'AUD' },
      { country: 'AZ', currence: 'AZN' },
      { country: 'GB', currence: 'GBP' },
      { country: 'AM', currence: 'AMD' },
      { country: 'BY', currence: 'BYN' },
      { country: 'BG', currence: 'BGN' },
      { country: 'BR', currence: 'BRL' },
      { country: 'HU', currence: 'HUF' },
      { country: 'HK', currence: 'HKD' },
      { country: 'DK', currence: 'DKK' },
      { country: 'US', currence: 'USD' },
      { country: 'AT', currence: 'EUR' },
      { country: 'BE', currence: 'EUR' },
      { country: 'DE', currence: 'EUR' },
      { country: 'GR', currence: 'EUR' },
      { country: 'IE', currence: 'EUR' },
      { country: 'ES', currence: 'EUR' },
      { country: 'IT', currence: 'EUR' },
      { country: 'CY', currence: 'EUR' },
      { country: 'LV', currence: 'EUR' },
      { country: 'LT', currence: 'EUR' },
      { country: 'LU', currence: 'EUR' },
      { country: 'MT', currence: 'EUR' },
      { country: 'NL', currence: 'EUR' },
      { country: 'PT', currence: 'EUR' },
      { country: 'SK', currence: 'EUR' },
      { country: 'SI', currence: 'EUR' },
      { country: 'FI', currence: 'EUR' },
      { country: 'FR', currence: 'EUR' },
      { country: 'EE', currence: 'EUR' },
      { country: 'IN', currence: 'INR' },
      { country: 'KZ', currence: 'KZT' },
      { country: 'CA', currence: 'CAD' },
      { country: 'KG', currence: 'KGS' },
      { country: 'CN', currence: 'CNY' },
      { country: 'MD', currence: 'MDL' },
      { country: 'NO', currence: 'NOK' },
      { country: 'PL', currence: 'PLN' },
      { country: 'RO', currence: 'RON' },
      { country: 'SG', currence: 'SGD' },
      { country: 'TJ', currence: 'TJS' },
      { country: 'TR', currence: 'TRY' },
      { country: 'TM', currence: 'TMT' },
      { country: 'UZ', currence: 'UZS' },
      { country: 'UA', currence: 'UAH' },
      { country: 'CZ', currence: 'CZK' },
      { country: 'CH', currence: 'SEK' },
      { country: 'SE', currence: 'CHF' },
      { country: 'ZA', currence: 'ZAR' },
      { country: 'KR', currence: 'KRW' },
      { country: 'JP', currence: 'JPY' },
    ];
    let myCurrence = 'USD';
    countryList.forEach((elem) => {
      if (country === elem.country) { myCurrence = elem.currence; }
    });
    const newcurrence = { ...Currence };
    newcurrence.FirstCurrence.code = myCurrence;
    setCurrence(newcurrence);
  };

  const updateData = async () => {
    await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then((response) => response.json())
      .then((response) => {
        const rate = { ...response };
        const valute = {
          ...rate.Valute,
          RUB: {
            CharCode: 'RUB',
            Name: 'Российский рубль',
            Nominal: 1,
            Value: 1,
          },
        };
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timezone: 'UTC',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
        };
        const date = new Date(Date.parse(rate.Date))
          .toLocaleString(navigator.language, options);
        const newData = { Date: date, Valute: valute };
        setDataCurrence(newData);
        setInterval(() => updateData(), 60000);
      });
  };

  useEffect(() => {
    const start = async () => {
      startCurrence();
      updateData();
    };
    start();
  }, []);

  const convert = () => {
    const infoFirstCurrence = dataCurrence.Valute[Currence.FirstCurrence.code];
    const infoSecondCurrence = dataCurrence.Valute[Currence.SecondCurrence.code];
    const attitudeFirstCurrence = infoFirstCurrence.Nominal / infoFirstCurrence.Value;
    const attitudeSecondCurrence = infoSecondCurrence.Nominal / infoSecondCurrence.Value;
    const convertAttitude = attitudeSecondCurrence / attitudeFirstCurrence;
    const Curr = { ...Currence };
    const newSecondCurrence = convertAttitude * Curr.FirstCurrence.value;
    Curr.SecondCurrence.value = Math.floor(newSecondCurrence * 100) / 100;
    setCurrence(Curr);
  };

  const changeInput = (elem) => {
    const name = elem.target.dataset.currence;
    const { value } = elem.target;
    const Curr = { ...Currence };
    if (!/[^0-9]/.test(value)) {
      Curr[name].value = value;
    }
    setCurrence(Curr);
    convert();
  };
  const changeSelect = (elem) => {
    const name = elem.target.dataset.currence;
    const { value } = elem.target;
    const Curr = { ...Currence };
    Curr[name].code = value;
    setCurrence(Curr);
    convert();
  };
  const removeCurrence = () => {
    const newCurrence = { ...Currence };
    const FirstCurrence = Currence.FirstCurrence.code;
    const SecondCurrence = Currence.SecondCurrence.code;
    newCurrence.FirstCurrence.code = SecondCurrence;
    newCurrence.SecondCurrence.code = FirstCurrence;
    setCurrence(newCurrence);
    convert();
  };

  const listRate = (
    <>
      <option value="RUB">RUB Российский рубль</option>
      <option value="AUD">AUD Австралийский доллар</option>
      <option value="AZN">AZN Азербайджанский манат</option>
      <option value="GBP">GBP Фунт стерлингов Соединенного королевства</option>
      <option value="AMD">AMD Армянских драмов</option>
      <option value="BYN">BYN Белорусский рубль</option>
      <option value="BGN">BGN Болгарский лев</option>
      <option value="BRL">BRL Бразильский реал</option>
      <option value="HUF">HUF Венгерских форинтов</option>
      <option value="HKD">HKD Гонконгских долларов</option>
      <option value="DKK">DKK Датских крон</option>
      <option value="USD">USD Доллар США</option>
      <option value="EUR">EUR Евро</option>
      <option value="INR">INR Индийских рупий</option>
      <option value="KZT">KZT Казахстанских тенге</option>
      <option value="CAD">CAD Канадский доллар</option>
      <option value="KGS">KGS Киргизских сомов</option>
      <option value="CNY">CNY Китайских юаней</option>
      <option value="MDL">MDL Молдавских леев</option>
      <option value="NOK">NOK Норвежских крон</option>
      <option value="PLN">PLN Польский злотый</option>
      <option value="RON">RON Румынский лей</option>
      <option value="SGD">SGD Сингапурский доллар</option>
      <option value="TJS">TJS Таджикских сомони</option>
      <option value="TRY">TRY Турецких лир</option>
      <option value="TMT">TMT Новый туркменский манат</option>
      <option value="UZS">UZS Узбекских сумов</option>
      <option value="UAH">UAH Украинских гривен</option>
      <option value="CZK">CZK Чешских крон</option>
      <option value="SEK">SEK Шведских крон</option>
      <option value="CHF">CHF Швейцарский франк</option>
      <option value="ZAR">ZAR Южноафриканских рэндов</option>
      <option value="KRW">KRW Вон Республики Корея</option>
      <option value="JPY">JPY Японских иен</option>
    </>
  );
  return (
    <div className="App">
      <div className="flex-Conteiner">
        <div className="title main-title">Simple currency converter</div>
        <div className="ConvertItem given">
          <div className="title">У меня есть</div>
          <input className="Currence" type="text" data-currence="FirstCurrence" onChange={changeInput} value={Currence.FirstCurrence.value} />
          <select data-currence="FirstCurrence" onChange={changeSelect} value={Currence.FirstCurrence.code}>
            { listRate }
          </select>
        </div>
        <button type="button" onClick={removeCurrence}>
          <img className="remove" src="./img/convert.svg" alt="convert.svg" />
        </button>
        <div className="ConvertItem received">
          <div className="title">Хочу приобрести</div>
          <div className="Currence" data-currence="SecondCurrence">{Currence.SecondCurrence.value}</div>
          <select data-currence="SecondCurrence" onChange={changeSelect} value={Currence.SecondCurrence.code}>
            {listRate}
          </select>
        </div>
        <div className="info">{`Данные за ${dataCurrence.Date}`}</div>
      </div>
    </div>
  );
};

export default App;
