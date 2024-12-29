import { useConnInfoStore } from "./store";

const ConnInfoForm = (props: any) => {
  const connInfoStore = useConnInfoStore();

  return (
    <>
      <div className="mb-3">
        <label className="form-label">name</label>
        <input
          type="text"
          className="form-control"
          value={connInfoStore.name}
          onChange={(e) => {
            connInfoStore.put("name", e.target.value);
          }}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">vendor</label>
        <select
          className="form-select"
          value={connInfoStore.vendor}
          onChange={(e) => {
            connInfoStore.put("vendor", e.target.value);
          }}
        >
          <option value="">Select</option>
          <option value="oracle">oracle</option>
          <option value="db2">db2</option>
          <option value="mssql">mssql</option>
          <option value="postgres">postgres</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">url</label>
        <input
          type="text"
          className="form-control"
          value={connInfoStore.jdbcUrl}
          onChange={(e) => {
            connInfoStore.put("jdbcUrl", e.target.value);
          }}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">driverClassName</label>
        <input
          type="text"
          className="form-control"
          value={connInfoStore.driverClassName}
          onChange={(e) => {
            connInfoStore.put("driverClassName", e.target.value);
          }}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">username</label>
        <input
          type="text"
          className="form-control"
          value={connInfoStore.username}
          onChange={(e) => {
            connInfoStore.put("username", e.target.value);
          }}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">password</label>
        <input
          type="password"
          className="form-control"
          value={connInfoStore.password}
          onChange={(e) => {
            connInfoStore.put("password", e.target.value);
          }}
        ></input>
      </div>
    </>
  );
};

export default ConnInfoForm;
