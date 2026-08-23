import type { ReactNode } from 'react';

import styles from './styles.module.scss';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface IProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string | number;
}

function Table<T>({ columns, data, getRowKey }: IProps<T>) {
  return (
    <div className={styles['table__wrapper']}>
      <table className={styles['table']}>
        <colgroup>
          {columns.map((column) => (
            <col key={String(column.key)} style={{ width: column.width }} />
          ))}
        </colgroup>

        <thead className={styles['table__head']}>
          <tr className={styles['table__row']}>
            {columns.map((column) => (
              <th className={styles['table__header']} key={String(column.key)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles['table__body']}>
          {data.map((item) => (
            <tr className={styles['table__row']} key={getRowKey(item)}>
              {columns.map((column) => (
                <td className={styles['table__cell']} key={String(column.key)}>
                  {column.render ? column.render(item) : String(item[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
