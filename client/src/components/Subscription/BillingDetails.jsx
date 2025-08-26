import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { CalendarIcon, CreditCardIcon, ReceiptIcon, TrendingUpIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import subscriptionService from '../../services/subscriptionService';

const BillingDetails = () => {
  const [billingDetails, setBillingDetails] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBillingDetails();
    fetchInvoices();
  }, [currentPage]);

  const fetchBillingDetails = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getBillingDetails();
      setBillingDetails(response.data);
    } catch (err) {
      setError('Failed to fetch billing details');
      console.error('Error fetching billing details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await subscriptionService.getInvoices(currentPage, 10);
      setInvoices(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error('Error fetching invoices:', err);
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      const transactionId = `TXN-${Date.now()}`; // Generate a mock transaction ID
      await subscriptionService.markInvoiceAsPaid(invoiceId, transactionId);
      fetchBillingDetails();
      fetchInvoices();
    } catch (err) {
      setError('Failed to mark invoice as paid');
      console.error('Error marking invoice as paid:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: 'secondary', text: 'Draft' },
      sent: { variant: 'default', text: 'Sent' },
      paid: { variant: 'default', text: 'Paid', className: 'bg-green-100 text-green-800' },
      overdue: { variant: 'destructive', text: 'Overdue' },
      cancelled: { variant: 'secondary', text: 'Cancelled' },
      refunded: { variant: 'secondary', text: 'Refunded' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getInvoiceTypeBadge = (type) => {
    const typeConfig = {
      initial: { variant: 'default', text: 'Initial' },
      renewal: { variant: 'default', text: 'Renewal' },
      upgrade: { variant: 'default', text: 'Upgrade', className: 'bg-blue-100 text-blue-800' },
      downgrade: { variant: 'secondary', text: 'Downgrade' },
      refund: { variant: 'secondary', text: 'Refund' }
    };

    const config = typeConfig[type] || { variant: 'secondary', text: type };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchBillingDetails} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptIcon className="h-5 w-5" />
            Billing Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(billingDetails?.summary?.totalPaid || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(billingDetails?.summary?.totalOutstanding || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Next Billing</p>
              <p className="text-lg font-semibold text-blue-600">
                {billingDetails?.summary?.nextBillingDate 
                  ? formatDate(billingDetails.summary.nextBillingDate)
                  : 'N/A'
                }
              </p>
              <p className="text-sm text-blue-600">
                {formatCurrency(billingDetails?.summary?.nextBillingAmount || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-purple-600">
                {billingDetails?.summary?.invoiceCount || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subscription */}
      {billingDetails?.currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-lg">
                  {billingDetails.currentSubscription.subscription?.name}
                </h4>
                <p className="text-gray-600">
                  {billingDetails.currentSubscription.subscription?.type} Plan
                </p>
                <p className="text-sm text-gray-500">
                  {billingDetails.currentSubscription.billingCycle} billing
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {formatCurrency(billingDetails.currentSubscription.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {formatDate(billingDetails.currentSubscription.endDate)}
                </p>
                <Badge variant={billingDetails.currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                  {billingDetails.currentSubscription.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices and Billing History */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-mono text-sm">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>
                        {getInvoiceTypeBadge(invoice.invoiceType)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Invoice Details</DialogTitle>
                              </DialogHeader>
                              {selectedInvoice && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Invoice Number</p>
                                      <p className="font-mono">{selectedInvoice.invoiceNumber}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Date</p>
                                      <p>{formatDate(selectedInvoice.createdAt)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Due Date</p>
                                      <p>{formatDate(selectedInvoice.dueDate)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Status</p>
                                      <div className="mt-1">
                                        {getStatusBadge(selectedInvoice.status)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Items</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Description</TableHead>
                                          <TableHead>Qty</TableHead>
                                          <TableHead>Unit Price</TableHead>
                                          <TableHead>Amount</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {selectedInvoice.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                              {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                                            </TableCell>
                                            <TableCell>
                                              {formatCurrency(item.amount, selectedInvoice.currency)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="text-right space-y-2">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                                    </div>
                                    {selectedInvoice.discount > 0 && (
                                      <div className="flex justify-between text-green-600">
                                        <span>Discount:</span>
                                        <span>-{formatCurrency(selectedInvoice.discount, selectedInvoice.currency)}</span>
                                      </div>
                                    )}
                                    {selectedInvoice.tax > 0 && (
                                      <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>{formatCurrency(selectedInvoice.tax, selectedInvoice.currency)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg">
                                      <span>Total:</span>
                                      <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                                    </div>
                                  </div>
                                  
                                  {selectedInvoice.status === 'sent' && (
                                    <div className="flex justify-end">
                                      <Button
                                        onClick={() => handleMarkAsPaid(selectedInvoice._id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                        Mark as Paid
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingDetails?.billingHistory?.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell>{formatDate(entry.startDate)}</TableCell>
                      <TableCell>
                        {entry.subscription?.name} - {entry.billingCycle} subscription
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(entry.amount, entry.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.status === 'active' ? 'default' : 'secondary'}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entry.subscription?.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDetails;