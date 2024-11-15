import { SessionItem, MessageItem, UserInput, Model } from '@/types/interface'
import { getUUID, parseTime } from './utils'
import { READ_ME_ID } from '@/config'
import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

export const useGlobalState = defineStore('store', {
    state: (): {
        sessionList: SessionItem[],
        messageList: {
            session_id: SessionItem['id'],
            message: MessageItem[]
        }[],
        userInputList: UserInput[],
        activeSessionId: SessionItem['id']
    } => ({
        sessionList: [{
            name: "使用说明",
            id: READ_ME_ID,
            mode: Model.Prompt,
            create_at: parseTime(new Date()),
            update_at: parseTime(new Date())
        }],
        messageList: [],
        userInputList: [{
            session_id: READ_ME_ID,
            placeholder: "说明文档，请仔细看",
            disabled: false,
            content: ""
        }],
        activeSessionId: READ_ME_ID
    }),
    getters: {
        activeSession: (state) => {
            return state.sessionList.find(item => item.id === state.activeSessionId)
        },
        activeMessages: (state) => {
            return state.messageList.find(item => item.session_id === state.activeSessionId)?.message ?? []
        },
        activeUserInput: (state) => {
            return state.userInputList.find(item => item.session_id === state.activeSessionId)
        }
    },
    actions: {
        addSession(name: SessionItem['name'], mode: Model = Model.Prompt) {
            const id = getUUID()
            this.sessionList.push({
                id: id,
                name,
                mode,
                create_at: parseTime(new Date()),
                update_at: parseTime(new Date())
            })
            this.messageList.push({
                session_id: id,
                message: []
            })
            this.userInputList.push({
                session_id: id,
                content: "",
                placeholder: '',
            })
            this.activeSessionId = id
        },
        setActiveSessionId(id: SessionItem['id']) {
            const item = this.sessionList.find(item => item.id === id)
            if (item) {
                this.activeSessionId = id
            } else {
                throw new Error('[setActiveSessionId],session_id not found')
            }
        },
        setSessionName(name: string, session_id?: SessionItem['id']) {
            const id = session_id ?? this.activeSessionId
            const index = this.sessionList.findIndex(item => item.id === id)
            if (index > -1) {
                this.sessionList[index].name = name
            } else {
                throw new Error('[setSessionName],session_id not found')
            }
        },

        setUserInputContent(content: string, session_id?: SessionItem['id']) {
            const id = session_id ?? this.activeSessionId
            const index = this.userInputList.findIndex(item => item.session_id === id)
            if (index > -1) {
                this.userInputList[index].content = content
            } else {
                throw new Error('[setUserInputContent],session_id not found')
            }
        },

    },
    persist: true
})