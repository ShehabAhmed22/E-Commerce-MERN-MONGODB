import React, { useState } from "react";
import { Eye, Package } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { STATUS_STYLES } from "../update-order/UpdateOrder";
import "./ViewOrder.css";

function ViewOrder({ order }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="vo-icon-btn"
        title="View order"
      >
        <Eye size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Order Details"
        size="lg"
      >
        <div className="vo-body">
          {/* Meta grid */}
          <div className="vo-meta">
            {[
              { label: "Order ID", value: order?._id, mono: true },
              {
                label: "Customer",
                value: order?.user?.name ?? order?.user ?? "—",
              },
              {
                label: "Date",
                value: order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "—",
              },
              {
                label: "Total",
                value: `$${order?.totalPrice?.toFixed(2)}`,
                bold: true,
              },
            ].map(({ label, value, mono, bold }) => (
              <div key={label} className="vo-meta__card">
                <p className="vo-meta__label">{label}</p>
                <p
                  className={`vo-meta__value${mono ? " vo-meta__value--mono" : ""}${bold ? " vo-meta__value--bold" : ""}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="vo-status-row">
            <span className="vo-status-label">Status</span>
            <span className={STATUS_STYLES[order?.status] ?? "badge"}>
              {order?.status}
            </span>
          </div>

          {/* Products table */}
          <div>
            <p className="vo-section-title">
              <Package size={14} /> Products ({order?.products?.length ?? 0})
            </p>
            <div className="vo-table-wrap">
              <table className="vo-table">
                <thead>
                  <tr>
                    {["Product", "Qty", "Unit Price", "Subtotal"].map((h) => (
                      <th key={h} className="vo-table__th">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order?.products?.map((item, i) => (
                    <tr key={i} className="vo-table__row">
                      <td className="vo-table__td vo-table__td--mono">
                        {item?.product?.name ?? item?.product ?? "—"}
                      </td>
                      <td className="vo-table__td vo-table__td--center">
                        {item?.quantity}
                      </td>
                      <td className="vo-table__td">
                        ${item?.productPrice?.toFixed(2)}
                      </td>
                      <td className="vo-table__td vo-table__td--bold">
                        ${(item?.quantity * item?.productPrice)?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ViewOrder;
