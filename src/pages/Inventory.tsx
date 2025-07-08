
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit, Trash2, AlertTriangle, Calendar } from 'lucide-react';
import { useInventory, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem } from '@/hooks/useInventory';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

type InventoryItem = Tables<'inventory'>;

const Inventory = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: '',
    unit: '',
    reorder_level: '',
    supplier_name: '',
    supplier_contact: '',
    cost: '',
    date_added: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const { data: inventory = [], isLoading } = useInventory();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const categories = [
    'Feed',
    'Medicine',
    'Equipment',
    'Supplements',
    'Cleaning Supplies',
    'Other'
  ];

  const units = [
    'kg', 'lbs', 'tons', 'bags', 'liters', 'gallons', 
    'pieces', 'boxes', 'bottles', 'sachets', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
    
    const itemData = {
      item_name: formData.item_name,
      category: finalCategory,
      quantity: parseFloat(formData.quantity) || 0,
      unit: formData.unit,
      reorder_level: parseFloat(formData.reorder_level) || null,
      supplier_name: formData.supplier_name || null,
      supplier_contact: formData.supplier_contact || null,
      cost: parseFloat(formData.cost) || null,
      notes: formData.notes || null,
    };

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...itemData });
      } else {
        await createItem.mutateAsync(itemData);
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      category: categories.includes(item.category) ? item.category : 'Other',
      quantity: item.quantity.toString(),
      unit: item.unit,
      reorder_level: item.reorder_level?.toString() || '',
      supplier_name: item.supplier_name || '',
      supplier_contact: item.supplier_contact || '',
      cost: item.cost?.toString() || '',
      date_added: format(new Date(item.created_at), 'yyyy-MM-dd'),
      notes: item.notes || '',
    });
    
    if (!categories.includes(item.category)) {
      setCustomCategory(item.category);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setCustomCategory('');
    setFormData({
      item_name: '',
      category: '',
      quantity: '',
      unit: '',
      reorder_level: '',
      supplier_name: '',
      supplier_contact: '',
      cost: '',
      date_added: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const getLowStockItems = () => {
    return inventory.filter(item => 
      item.reorder_level && Number(item.quantity) <= Number(item.reorder_level)
    );
  };

  const lowStockItems = getLowStockItems();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📦 Inventory Management</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert ({lowStockItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded">
                    <div>
                      <span className="font-medium">{item.item_name}</span>
                      <span className="text-sm text-gray-600 ml-2">({item.category})</span>
                    </div>
                    <Badge variant="destructive">
                      {item.quantity} {item.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{inventory.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          {inventory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No inventory items yet. Add your first item!</p>
              </CardContent>
            </Card>
          ) : (
            inventory.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.item_name}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                        {item.reorder_level && Number(item.quantity) <= Number(item.reorder_level) && (
                          <Badge variant="destructive">Low Stock</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <p className="font-medium">{item.quantity} {item.unit}</p>
                        </div>
                        
                        {item.cost && (
                          <div>
                            <span className="text-gray-600">Cost:</span>
                            <p className="font-medium">KSh {Number(item.cost).toLocaleString()}</p>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-gray-600">Added:</span>
                          <p className="font-medium">{format(new Date(item.created_at), 'MMM d, yyyy')}</p>
                        </div>
                        
                        {item.reorder_level && (
                          <div>
                            <span className="text-gray-600">Reorder at:</span>
                            <p className="font-medium">{item.reorder_level} {item.unit}</p>
                          </div>
                        )}
                      </div>
                      
                      {item.supplier_name && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="ml-1">{item.supplier_name}</span>
                          {item.supplier_contact && (
                            <span className="text-gray-500"> ({item.supplier_contact})</span>
                          )}
                        </div>
                      )}
                      
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {item.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Item Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_name">Item Name *</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                    placeholder="e.g., Dairy Meal, Dewormer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.category === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="custom_category">Specify Category *</Label>
                  <Input
                    id="custom_category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (KSh)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorder_level">Reorder Level</Label>
                  <Input
                    id="reorder_level"
                    type="number"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, reorder_level: e.target.value }))}
                    placeholder="Alert when stock is low"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_added">Date Added</Label>
                  <Input
                    id="date_added"
                    type="date"
                    value={formData.date_added}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_added: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_name">Supplier Name</Label>
                  <Input
                    id="supplier_name"
                    value={formData.supplier_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
                    placeholder="Supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier_contact">Supplier Contact</Label>
                  <Input
                    id="supplier_contact"
                    value={formData.supplier_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier_contact: e.target.value }))}
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createItem.isPending || updateItem.isPending}
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Inventory;
