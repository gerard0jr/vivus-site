import axios from 'axios'

// const apiUrl = 'https://tk4f.com.mx/efectigo/TraceIdentityService/Api' change to VIVUS
const apiUrl = 'https://tk4f-stage.com.mx/stagevivus/TraceIdentityService/api'

// SECURITY //
export const getToken = () => 
    axios.post(`${apiUrl}/Security/RequestToken`, {username: 'Fr0ntV1vu5', password: 'b2dbb203bb33dc419d57ad540f866812'})
        .then(token => token)
        .catch(err => err)

// PORTFOLIO
export const getCustomerBalance = (data, token) => 
    axios.post(`${apiUrl}/Portfolio/GetCustomerBalance`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(balance => balance)
        .catch(err => err)

export const getAccountStatement = (data, token) => 
    axios.post(`${apiUrl}/Portfolio/GetAccountStatement`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(accStatement => accStatement)
        .catch(err => err)

export const getOXXOPaymentReference = (data, token) => 
    axios.post(`${apiUrl}/Portfolio/GetOXXOPaymentReference`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(oxxoRef => oxxoRef)
        .catch(err => err)

export const getBankPaymentReference = (data, token) => 
    axios.post(`${apiUrl}/Portfolio/GetBankPaymentReference`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(bankRef => bankRef)
        .catch(err => err)

export const getPaymentsDetail = (data, token) => 
    axios.post(`${apiUrl}/Portfolio/GetPaymentsDetail`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(paymentDet => paymentDet)
        .catch(err => err)

// SIMNULATOR // 
export const getConfiguration = (idProduct, token) => 
    axios.post(`${apiUrl}/Simulator/GetConfiguration`, {idProduct}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(configuration => configuration)
        .catch(err => err)

export const getSimulation = (idProduct, amount = 0, frequency, term, idClient, token) => {
    return axios.post(`${apiUrl}/Simulator/GetSimulation`, {idProduct, amount, frequency, term, idClient}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(simulation => simulation)
        .catch(err => err)
    }

export const getProposal = (idProduct, idCustomer, token) => 
    axios.post(`${apiUrl}/Simulator/GetProposal`, {idProduct, idCustomer}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(proposal => proposal)
        .catch(err => err)

export const saveProposal = (idProduct, idCustomer, amount, frequency, term, token) => 
    axios.post(`${apiUrl}/Simulator/SaveProposal`, {idProduct, idCustomer, amount, frequency, term}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(proposal => proposal)
        .catch(err => err)
        
// QUIESTIONNAIRE
export const getQuestionnaire = (data, token) => 
    axios.post(`${apiUrl}/Questionnaire/GetQuestionnaire`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(questions => questions)
        // .catch(err => err)

export const answerQuestionnaire = (data, token) => 
    axios.post(`${apiUrl}/Questionnaire/AnswerQuestionnaire`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(answers => answers)
        .catch(err => err)

// RISK engine
export const getRiskResult = (data, token) => 
    axios.post(`${apiUrl}/Risk/GetRiskResult`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(risk => risk)
        // .catch(err => err)

// IVR
export const getCustomerByPhone = (phone, token) => 
    axios.post(`${apiUrl}/IVR/GetCustomerByPhone`, {phone}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(customer => customer)
        .catch(err => err)

//  ECM  //
export const getContract = (idProduct, idCustomer, token) => 
    axios.post(`${apiUrl}/ECM/GetContract`, {idProduct, idCustomer, returnPDF: false}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(contract => contract)
        .catch(err => err)

export const getFilledContract = (data, token) => 
    axios.post(`${apiUrl}/ECM/GetFilledContract`, {...data, returnPDF: true}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(contract => contract)
        .catch(err => err)
            
export const getTermsAndConditions = (idProduct, idCustomer, token) => 
    axios.post(`${apiUrl}/ECM/GetTermsAndConditions`, {idProduct, idCustomer, returnPDF: false}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(terms => terms)
        .catch(err => err)

export const getFinancialEducation = (idProduct, idCustomer, token) => 
    axios.post(`${apiUrl}/ECM/GetFinancialEducation`, {idProduct, idCustomer, returnPDF: false}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(education => education)
        .catch(err => err)

export const getFile = (data, token) => 
    axios.post(`${apiUrl}/ECM/GetFile`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(file => file)
        .catch(err => err)

export const uploadFile = (data, token) => 
    axios.post(`${apiUrl}/ECM/UploadFile`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(file => file)
        .catch(err => err)

//  CUSTOMER SECURITY        
export const login = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/LogInCustomer`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(loggedCustomer => loggedCustomer)
        .catch(err => err)

export const recoverPassword = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/RecoverPassword`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(recoverPassword => recoverPassword)
        .catch(err => err)
        
export const checkCode = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/CheckCode`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(checkCode => checkCode)
        .catch(err => err)

export const changePassword = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/ChangePassword`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(changePass => changePass)
        .catch(err => err)
        
export const sendCodeByNewEMail = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/SendCodeByNewEMail`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

export const sendCodeByNewSMS = (data, token) => 
    axios.post(`${apiUrl}/CustomerSecurity/SendCodeByNewSMS`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

// CUSTOMER CARE
export const changeCustomerEmail = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/ChangeCustomerEmail`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

export const changeCustomerMobile = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/ChangeCustomerMobile`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

export const requestExtension = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/RequestExtension`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(extension => extension)
        .catch(err => err)

export const requestAdditionalAmount = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/RequestAdditionalAmount`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(additional => additional)

export const changeCLABE = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/ChangeCLABEAccount`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(clabe => clabe)

export const changeDebit = (data, token) => 
    axios.post(`${apiUrl}/CustomerCare/ChangeDebitCard`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(debit => debit)

//  CUSTOMER //
export const getCustomerByMail = (idProduct, eMail, token) => 
    axios.post(`${apiUrl}/Customer/GetCustomerByMail`, {idProduct, eMail}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(customer => customer)
        .catch(err => err)

export const getStatus = (idProduct, idCustomer, isNIP, token) => 
    axios.post(`${apiUrl}/Customer/GetStatus`, {idProduct, idCustomer, isNIP}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(status => status)
        .catch(err => err)

export const sendCodeByEMail = (data, token) => 
    axios.post(`${apiUrl}/Customer/SendCodeByEMail`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

export const sendCodeBySMS = (data, token) => 
    axios.post(`${apiUrl}/Customer/SendCodeBySMS`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(code => code)
        .catch(err => err)

export const checkSecurityCode = (data, token) => 
    axios.post(`${apiUrl}/Customer/CheckSecurityCode`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(codeChecked => codeChecked)
        .catch(err => err)

export const setContractAuthorization = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetContractAuthorization`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(authorized => authorized)
        .catch(err => err)

export const setBureauAuthorization = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetBureauAuthorization`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(auth => auth)
        .catch(err => err)

export const getDirectDebitInformation = (data, token) => 
    axios.post(`${apiUrl}/Customer/GetDirectDebitInformation`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(debitAuth => debitAuth)
        .catch(err => err)

export const setDirectDebitAuthorization = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetDirectDebitAuthorization`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(debitAuth => debitAuth)
        .catch(err => err)

    // REGISTER
export const getRegistration = (idProduct, idCustomer, eMail, token) => 
        axios.post(`${apiUrl}/Customer/GetRegistration`, {idProduct, idCustomer, eMail}, {headers: {'Authorization': `Bearer ${token}`}})
            .then(register => register)
            .catch(err => err)

export const setRegistration = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetRegistration`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(register => register)
        .catch(err => err)
        
    // PERSONAL DATA
export const getPersonalInformation = (data, token) => 
        axios.post(`${apiUrl}/Customer/GetPersonalInformation`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
            .then(personalInfo => personalInfo)
            .catch(err => err)

export const setPersonalInformation = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetPersonalInformation`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(setPerInfo => setPerInfo)
        // .catch(err => err)

        // EMPLOYMENT
export const getEmploymentInformation = (data, token) => 
    axios.post(`${apiUrl}/Customer/GetEmploymentInformation`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(employmentInfo => employmentInfo)
        .catch(err => err)

export const setEmploymentInformation = (data, token) => 
    axios.post(`${apiUrl}/Customer/SetEmploymentInformation`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(employmentInfo => employmentInfo)
        .catch(err => err)
        
// CATALOGS
export const getBanks = (token) => 
    axios.post(`${apiUrl}/Catalog/GetBanks`, {}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(banks => banks)
        .catch(err => err)

export const getCatalogs = (token) => 
    axios.post(`${apiUrl}/Catalog/GetCatalogs`, {}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(catalogs => catalogs)
        .catch(err => err)

export const getSingleCatalog = (data, token) => 
    axios.post(`${apiUrl}/Catalog/GetSingleCatalog`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(catalog => catalog)
        .catch(err => err)

export const getCatalogByZipCode = (data, token) => 
    axios.post(`${apiUrl}/Catalog/GetCatalogByZipCode`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(zipCatalog => zipCatalog)
        .catch(err => err)

// MARKETING
export const getAnalytics = (data, token) => 
    axios.post(`${apiUrl}/Marketing/GetGACustomerData`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(analytics => analytics)
        .catch(err => err)

export const saveSingleUTM = (data, token) => 
    axios.post(`${apiUrl}/Marketing/saveSingleUTM`, {...data}, {headers: {'Authorization': `Bearer ${token}`}})
        .then(analytics => analytics)
        .catch(err => err)