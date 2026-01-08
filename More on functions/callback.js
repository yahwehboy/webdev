function notifyUser(notifyFn){
    notifyFn()
}

const emailNotification = () => console.log('Email sent')
const smsNotifocation = () => console.log('SMS sent')

notifyUser(emailNotification)
notifyUser(smsNotifocation)