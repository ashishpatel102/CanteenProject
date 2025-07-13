import { useState, useEffect } from "react";
import URL from "../../utils/service";

function PaymentList() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`${URL}/api/orders/payments`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    setError(response.message);
                    throw new Error("Failed to fetch payments");
                }
                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(payment =>
        payment.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.refundStatus.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mt-4">
            <h1 className="mb-4 text-center text-primary fw-bold">Payment List</h1>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by Payment ID, User ID, Method, Status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loading && <div className="text-primary text-center">Loading payments...</div>}
            {error && <div className="alert alert-danger text-center">Error: {error}</div>}
            {!loading && !error && (
                <div className="table-responsive p-2">
                    <table className="table table-bordered table-hover text-center " style={{ overflow: 'hidden', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,.1)' }}>
                        <thead className="table-success">
                            <tr>
                                <th>Payment ID</th>
                                <th>User ID</th>
                                <th>Amount (₹)</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Refund Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id}>
                                        <td>{payment.paymentId}</td>
                                        <td>{payment.userId}</td>
                                        <td className="font-weight-bold">₹{payment.amount}</td>
                                        <td>{payment.method}</td>
                                        <td className={
                                            payment.status === "success" ? "text-success font-weight-bold" :
                                                payment.status === "pending" ? "text-warning font-weight-bold" : "text-danger font-weight-bold"
                                        }>
                                            {payment.status}
                                        </td>
                                        <td className={
                                            payment.refundStatus === "not_requested" ? "text-secondary" :
                                                payment.refundStatus === "processing" ? "text-warning" : "text-success"
                                        }>
                                            {payment.refundStatus}
                                        </td>
                                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-danger font-weight-bold">No matching payments found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PaymentList;