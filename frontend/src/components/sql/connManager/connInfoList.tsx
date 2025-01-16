import { useDeleteConnInfo, useGetConnInfoList } from "./connManager.query";
import { useConnInfoStore } from "./connManager.store";

const ConnInfoList = () => {
  const connInfoStore = useConnInfoStore();
  const { data: connInfoList } = useGetConnInfoList();
  const { mutateAsync: deleteConnInfo } = useDeleteConnInfo();

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">name</th>
          <th scope="col">vendor</th>
          <th scope="col">jdbcUrl</th>
          <th scope="col">username</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {connInfoList?.map((conn: ConnInfo, i: number) => (
          <tr
            key={conn.name}
            onClick={() => {
              connInfoStore.setConnInfo(conn);
            }}
          >
            <th scope="row">{i + 1}</th>
            <td>{conn.name}</td>
            <td>{conn.vendor}</td>
            <td>{conn.jdbcUrl}</td>
            <td>{conn.username}</td>
            <td className="align-middle">
              <button className="btn-close" onClick={() => deleteConnInfo(conn.name)}></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConnInfoList;
