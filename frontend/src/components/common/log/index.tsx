import { useEffect, useRef, useState } from "react";
import taskLogApi from "./taskLog.api";
import { Button } from "primereact/button";

type JobLogProps = {
  jobId: string;
  tryTime?: number;
  onFinished?: () => void;
};

let start: number = 0;

const JobLog = ({ jobId, tryTime = 2000, onFinished = () => {} }: JobLogProps) => {
  const textRef = useRef<HTMLTextAreaElement>();
  const [isStart, setStart] = useState(false);
  const [logsState, setLogsState] = useState("");

  useEffect(() => {
    if (jobId) {
      start = 0;
      textRef.current.value = "";
      setStart(true);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      if (isStart) {
        setLogsState("progress...");
        const timerId: number = window.setInterval(getLogs, tryTime);
        return () => {
          if (timerId) {
            window.clearTimeout(timerId);
          }
        };
      } else {
        setLogsState("");
      }
    }
  }, [isStart]);

  const getLogs = async () => {
    if (!jobId) {
      setStart(false);
      return;
    }

    const taskLog = await taskLogApi.getTaskLog({ id: parseInt(jobId, 10), start });
    const logMessages = taskLog.taskLogMessages;

    if (logMessages != null && logMessages.length) {
      const lines = logMessages.map(
        (log: any) => `${taskLog.id} ${log.no} ${log.loggingDate} ${log.message}`,
      );

      textRef.current.value += lines.join("\n") + "\n";
      textRef.current.scrollTop = textRef.current.scrollHeight;

      start += lines.length;
    }

    if (taskLog.state == "FINISHED") {
      setStart(false);
      onFinished();
    } else if (taskLog.state == "ERROR") {
      setStart(false);
      onFinished();
    }
  };

  return (
    <div className="w-100 h-100">
      <div className="w-100 h-100 flex flex-column">
        <div className="flex justify-content-between">
          <div className="flex align-items-center">{logsState}</div>
          {isStart ? (
            <Button
              icon="pi pi-pause"
              text
              aria-label="pause"
              onClick={() => {
                setStart(false);
              }}
            />
          ) : (
            <Button
              icon="pi pi-play"
              text
              aria-label="play"
              onClick={() => {
                setStart(true);
              }}
            />
          )}
        </div>
        <div className="flex-grow-1">
          <textarea
            ref={textRef}
            className="w-100 h-100 border-primary"
            spellCheck="false"
            style={{ outline: "none" }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default JobLog;
