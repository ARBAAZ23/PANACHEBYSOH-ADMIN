import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";


const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Fetch all invoices
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}api/order/invoices`);
            setInvoices(res.data.invoices || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Failed to fetch invoices");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Download Invoice PDF
    const downloadInvoice = async (invoiceId) => {
        try {

            const link = document.createElement("a");
            link.href = backendUrl + "uploads/invoices/" + "Invoice-" + invoiceId + ".pdf";
            link.setAttribute("download", `Invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Invoice downloaded successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download invoice");
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // ✅ Filter invoices based on search term
    const filteredInvoices = invoices.filter((invoice) => {
        const name = invoice.user?.name?.toLowerCase() || "";
        const email = invoice.user?.email?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return name.includes(term) || email.includes(term);
    });

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <img src={assets.invoice} alt="invoice icon" className="w-8 h-8" />
                    All Invoices
                </h2>

                {/* 🔍 Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by customer or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading invoices...</div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No invoices found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInvoices.map((invoice, index) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-all">
                                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {invoice.user?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {invoice.user?.email || "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                            £{invoice.amount?.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => downloadInvoice(invoice._id)}
                                                className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-all"
                                            >
                                                <img src={assets.download_icon} alt="Download" className="w-4 h-4" />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invoice;
