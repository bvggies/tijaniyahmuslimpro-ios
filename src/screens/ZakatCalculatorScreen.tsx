import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../utils/theme';
import './ZakatCalculatorScreen.css';

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'GHS' | 'NGN';

interface ZakatInputs {
  cash: string;
  goldGrams: string;
  goldValue: string;
  silverGrams: string;
  silverValue: string;
  businessAssets: string;
  investments: string;
  receivables: string;
  debts: string;
}

const ZakatCalculatorScreen: React.FC = () => {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [inputs, setInputs] = useState<ZakatInputs>({
    cash: '',
    goldGrams: '',
    goldValue: '',
    silverGrams: '',
    silverValue: '',
    businessAssets: '',
    investments: '',
    receivables: '',
    debts: '',
  });
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(75);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(0.9);

  const parse = (v: string): number => {
    const n = parseFloat((v || '').replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const goldTotal = useMemo(() => {
    const grams = parse(inputs.goldGrams);
    const explicit = parse(inputs.goldValue);
    if (explicit > 0) return explicit;
    return grams * goldPricePerGram;
  }, [inputs.goldGrams, inputs.goldValue, goldPricePerGram]);

  const silverTotal = useMemo(() => {
    const grams = parse(inputs.silverGrams);
    const explicit = parse(inputs.silverValue);
    if (explicit > 0) return explicit;
    return grams * silverPricePerGram;
  }, [inputs.silverGrams, inputs.silverValue, silverPricePerGram]);

  const totalZakatable = useMemo(() => {
    const cash = parse(inputs.cash);
    const business = parse(inputs.businessAssets);
    const invest = parse(inputs.investments);
    const recv = parse(inputs.receivables);
    const debts = parse(inputs.debts);
    const gross = cash + goldTotal + silverTotal + business + invest + recv;
    return Math.max(0, gross - debts);
  }, [inputs, goldTotal, silverTotal]);

  const nisab = useMemo(() => {
    const goldNisab = 85 * goldPricePerGram;
    const silverNisab = 595 * silverPricePerGram;
    return Math.min(goldNisab, silverNisab);
  }, [goldPricePerGram, silverPricePerGram]);

  const zakatDue = useMemo(() => totalZakatable * 0.025, [totalZakatable]);
  const isEligible = totalZakatable >= nisab;

  const setField = (field: keyof ZakatInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setInputs({
      cash: '',
      goldGrams: '',
      goldValue: '',
      silverGrams: '',
      silverValue: '',
      businessAssets: '',
      investments: '',
      receivables: '',
      debts: '',
    });
  };

  const saveCalculation = () => {
    try {
      const entry = {
        ts: Date.now(),
        currency,
        inputs,
        totals: { totalZakatable, zakatDue, nisab },
      };
      const raw = localStorage.getItem('zakat_calculator_history_v1');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      localStorage.setItem('zakat_calculator_history_v1', JSON.stringify(list.slice(0, 10)));
      window.alert('Success\nCalculation saved!');
    } catch (e) {
      window.alert('Error\nFailed to save calculation.');
    }
  };

  return (
    <div className="zakat-container">
      <div className="zakat-header">
        <h1 className="zakat-header-title">Zakat Calculator</h1>
        <p className="zakat-header-subtitle">Calculate your Zakat obligation</p>
      </div>

      {/* Currency */}
      <div className="zakat-section">
        <h2 className="zakat-section-title">Currency</h2>
        <div className="zakat-pills-row">
          {(['USD', 'EUR', 'GBP', 'GHS', 'NGN'] as CurrencyCode[]).map((code) => (
            <button
              key={code}
              className={`zakat-pill ${currency === code ? 'zakat-pill-active' : ''}`}
              onClick={() => setCurrency(code)}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Nisab */}
      <div className="zakat-section">
        <h2 className="zakat-section-title">Nisab Threshold</h2>
        <div className="zakat-card">
          <div className="zakat-nisab-row">
            <div className="zakat-nisab-col">
              <p className="zakat-nisab-label">85g Gold</p>
              <p className="zakat-nisab-value">{currency} {(85 * goldPricePerGram).toFixed(2)}</p>
            </div>
            <div className="zakat-nisab-col">
              <p className="zakat-nisab-label">595g Silver</p>
              <p className="zakat-nisab-value">{currency} {(595 * silverPricePerGram).toFixed(2)}</p>
            </div>
          </div>
          <p className="zakat-info-text">Nisab is the minimum amount of wealth one must have before Zakat becomes obligatory. Use the lower value between gold and silver.</p>
        </div>
      </div>

      {/* Assets */}
      <div className="zakat-section">
        <h2 className="zakat-section-title">Your Assets</h2>
        <div className="zakat-card">
          <div className="zakat-input-group">
            <label className="zakat-input-label">Cash & Savings</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter amount"
              value={inputs.cash}
              onChange={(e) => setField('cash', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Gold (grams)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter grams"
              value={inputs.goldGrams}
              onChange={(e) => setField('goldGrams', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Gold Value (optional)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter value directly"
              value={inputs.goldValue}
              onChange={(e) => setField('goldValue', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Silver (grams)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter grams"
              value={inputs.silverGrams}
              onChange={(e) => setField('silverGrams', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Silver Value (optional)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter value directly"
              value={inputs.silverValue}
              onChange={(e) => setField('silverValue', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Business Assets</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter amount"
              value={inputs.businessAssets}
              onChange={(e) => setField('businessAssets', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Investments</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter amount"
              value={inputs.investments}
              onChange={(e) => setField('investments', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Receivables (money owed to you)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter amount"
              value={inputs.receivables}
              onChange={(e) => setField('receivables', e.target.value)}
            />
          </div>

          <div className="zakat-input-group">
            <label className="zakat-input-label">Debts (money you owe)</label>
            <input
              type="number"
              className="zakat-input"
              placeholder="Enter amount"
              value={inputs.debts}
              onChange={(e) => setField('debts', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="zakat-section">
        <h2 className="zakat-section-title">Zakat Calculation</h2>
        <div className="zakat-card">
          <div className={`zakat-stat-row ${isEligible ? 'zakat-stat-row-highlight' : ''}`}>
            <span className={`zakat-stat-label ${isEligible ? 'zakat-stat-label-highlight' : ''}`}>Total Zakatable Wealth</span>
            <span className={`zakat-stat-value ${isEligible ? 'zakat-stat-value-highlight' : ''}`}>
              {currency} {totalZakatable.toFixed(2)}
            </span>
          </div>
          <div className={`zakat-stat-row ${isEligible ? 'zakat-stat-row-highlight' : ''}`}>
            <span className={`zakat-stat-label ${isEligible ? 'zakat-stat-label-highlight' : ''}`}>Nisab</span>
            <span className={`zakat-stat-value ${isEligible ? 'zakat-stat-value-highlight' : ''}`}>
              {currency} {nisab.toFixed(2)}
            </span>
          </div>
          <div className={`zakat-stat-row ${isEligible ? 'zakat-stat-row-highlight' : ''}`}>
            <span className={`zakat-stat-label ${isEligible ? 'zakat-stat-label-highlight' : ''}`}>Zakat Due (2.5%)</span>
            <span className={`zakat-stat-value ${isEligible ? 'zakat-stat-value-highlight' : ''}`}>
              {currency} {zakatDue.toFixed(2)}
            </span>
          </div>
          {!isEligible && (
            <p className="zakat-info-text" style={{ marginTop: '12px', color: '#FF9800' }}>
              Your wealth is below the Nisab threshold. Zakat is not obligatory at this time.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="zakat-section">
        <div className="zakat-actions">
          <button className="zakat-reset-button" onClick={reset}>
            Reset
          </button>
          <button className="zakat-save-button" onClick={saveCalculation}>
            Save Calculation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculatorScreen;

