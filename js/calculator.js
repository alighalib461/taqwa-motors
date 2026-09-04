/**
 * Taqwa Motors - Car Financing & EMI Calculator
 * Rawalpindi, Pakistan
 */

function formatPKRCurrency(amount) {
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2);
    return `PKR ${crore} Crore`;
  } else if (amount >= 100000) {
    const lac = (amount / 100000).toFixed(2);
    return `PKR ${lac} Lacs`;
  }
  return `PKR ${Math.round(amount).toLocaleString()}`;
}

function calculateEMI(principal, annualRate, tenureYears) {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) return principal / totalMonths;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

function initEmiCalculator() {
  const priceSlider = document.getElementById("calcPriceSlider");
  const downPaymentSlider = document.getElementById("calcDownPaymentSlider");
  const tenureSlider = document.getElementById("calcTenureSlider");
  const rateSlider = document.getElementById("calcRateSlider");

  const priceVal = document.getElementById("calcPriceVal");
  const downPaymentVal = document.getElementById("calcDownPaymentVal");
  const tenureVal = document.getElementById("calcTenureVal");
  const rateVal = document.getElementById("calcRateVal");

  const monthlyEmiDisplay = document.getElementById("calcMonthlyEmiDisplay");
  const downPaymentAmountDisplay = document.getElementById("calcDownPaymentAmountDisplay");
  const loanPrincipalDisplay = document.getElementById("calcLoanPrincipalDisplay");
  const totalMarkupDisplay = document.getElementById("calcTotalMarkupDisplay");
  const totalPayableDisplay = document.getElementById("calcTotalPayableDisplay");
  const whatsappCalcBtn = document.getElementById("calcWhatsAppBtn");

  if (!priceSlider) return;

  function updateCalculations() {
    const vehiclePrice = parseFloat(priceSlider.value);
    const downPaymentPercent = parseFloat(downPaymentSlider.value);
    const tenureYears = parseInt(tenureSlider.value, 10);
    const annualRate = parseFloat(rateSlider.value);

    const downPaymentAmount = Math.round(vehiclePrice * (downPaymentPercent / 100));
    const loanPrincipal = vehiclePrice - downPaymentAmount;
    const monthlyEmi = calculateEMI(loanPrincipal, annualRate, tenureYears);
    const totalMonths = tenureYears * 12;
    const totalLoanPayment = monthlyEmi * totalMonths;
    const totalMarkup = totalLoanPayment - loanPrincipal;
    const totalPayable = downPaymentAmount + totalLoanPayment;

    // Update labels
    if (priceVal) priceVal.textContent = formatPKRCurrency(vehiclePrice);
    if (downPaymentVal) downPaymentVal.textContent = `${downPaymentPercent}% (${formatPKRCurrency(downPaymentAmount)})`;
    if (tenureVal) tenureVal.textContent = `${tenureYears} Year${tenureYears > 1 ? 's' : ''} (${totalMonths} Months)`;
    if (rateVal) rateVal.textContent = `${annualRate}% p.a.`;

    // Update result cards
    if (monthlyEmiDisplay) monthlyEmiDisplay.textContent = `PKR ${monthlyEmi.toLocaleString()} / mo`;
    if (downPaymentAmountDisplay) downPaymentAmountDisplay.textContent = formatPKRCurrency(downPaymentAmount);
    if (loanPrincipalDisplay) loanPrincipalDisplay.textContent = formatPKRCurrency(loanPrincipal);
    if (totalMarkupDisplay) totalMarkupDisplay.textContent = formatPKRCurrency(totalMarkup);
    if (totalPayableDisplay) totalPayableDisplay.textContent = formatPKRCurrency(totalPayable);

    // Update WhatsApp CTA button
    if (whatsappCalcBtn) {
      whatsappCalcBtn.onclick = () => {
        window.sendEmiToWhatsApp("Custom Calculation", vehiclePrice, downPaymentAmount, monthlyEmi, tenureYears);
      };
    }
  }

  priceSlider.addEventListener("input", updateCalculations);
  downPaymentSlider.addEventListener("input", updateCalculations);
  tenureSlider.addEventListener("input", updateCalculations);
  rateSlider.addEventListener("input", updateCalculations);

  updateCalculations();
}

window.initEmiCalculator = initEmiCalculator;
window.formatPKRCurrency = formatPKRCurrency;
window.calculateEMI = calculateEMI;
