
interface DownloadProcess {
    process: number
    loaded: number
    total: number
}

const downloadProcess = new Map<AIModel, DownloadProcess>()
const cancelMap = new Map<AIModel, () => void>()

export const useModelDownload = () => {

    const sessionOption = (model: AIModel): {
        monitor: AICreateMonitorCallback,
        signal?: AbortSignal;
    } => {
        const controller = new AbortController()
        cancelMap.set(model, controller.abort)
        return {
            signal: controller.signal,
            monitor: (monitor) => {
                monitor.addEventListener('downloadprogress', ({ loaded, total }) => {
                    console.log("downloadprogress", loaded, total)
                    const process = loaded / total
                    downloadProcess.set(model, { process, loaded, total })
                })
            }
        }
    }
    const getProcess = (model: AIModel) => {
        return downloadProcess.get(model)
    }

    const cancelDownload = (model: AIModel) => {
        const cancel = cancelMap.get(model)
        cancel?.()
        downloadProcess.delete(model)
    }

    return {
        sessionOption,
        cancelDownload,
        getProcess

    }
}