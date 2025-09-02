# Printer Setup Guide

## Supported Printer Types

### 1. USB Thermal Printers (ESC/POS)

**Popular Models**:
- Epson TM-T20II, TM-T82, TM-T88V
- Star TSP143III, TSP654II
- Citizen CT-S310A, CT-S4000

**Setup**:
```env
PRINTER_TYPE=usb
USB_VENDOR_ID=0x04b8    # Epson
USB_PRODUCT_ID=0x0202   # TM-T20II
```

**Find USB IDs**:
```bash
# Linux/Mac
lsusb

# Windows
wmic path Win32_PnPEntity where "Name like '%printer%'" get Name,DeviceID
```

### 2. Network Thermal Printers

**Setup**:
```env
PRINTER_TYPE=network
PRINTER_IP=192.168.1.100
PRINTER_PORT=9100
```

**Test Connection**:
```bash
# Test if printer responds on port 9100
telnet 192.168.1.100 9100
```

### 3. Mock Printer (Development)

**Setup**:
```env
PRINTER_TYPE=mock
```

Prints to console for development and testing.

## Common ESC/POS Commands

```javascript
// Text formatting
printer.font('a')        // Font A (12x24)
printer.font('b')        // Font B (9x17)
printer.align('ct')      // Center align
printer.align('lt')      // Left align
printer.align('rt')      // Right align
printer.style('bu')      // Bold + Underline
printer.size(2, 2)       // Double width/height

// Special commands
printer.text('Hello')    // Print text
printer.newLine()        // Line feed
printer.drawLine()       // Print dashed line
printer.cut()            // Cut paper
printer.cashdraw(2)      // Open cash drawer
```

## Troubleshooting

### USB Printer Issues

**Permission denied**:
```bash
# Linux - add user to dialout group
sudo usermod -a -G dialout $USER

# Or run with sudo (not recommended for production)
sudo node src/worker.js
```

**Device not found**:
- Check USB connection
- Verify vendor/product IDs with `lsusb`
- Try different USB port

### Network Printer Issues

**Connection timeout**:
- Verify printer IP address
- Check if port 9100 is open
- Ensure printer is on same network

**Print jobs not appearing**:
- Check printer queue/status
- Verify ESC/POS compatibility
- Try sending raw text first

### General Issues

**No output**:
- Check printer paper
- Verify power connection
- Test with manufacturer's software first

**Garbled text**:
- Check character encoding
- Verify ESC/POS command sequence
- Try different font settings

## Production Deployment

### Docker Setup
```dockerfile
# Add printer drivers to container
RUN apt-get update && apt-get install -y \
    libusb-1.0-0-dev \
    libudev-dev

# For USB printers, mount device
docker run --device=/dev/usb/lp0 manila-printer
```

### Systemd Service (Linux)
```ini
[Unit]
Description=Manila Printer Service
After=network.target

[Service]
Type=simple
User=printer
WorkingDirectory=/opt/manila-printer
ExecStart=/usr/bin/node src/worker.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Windows Service
Use `node-windows` package to create Windows service:

```javascript
import { Service } from 'node-windows';

const svc = new Service({
  name: 'Manila Printer Service',
  description: 'Manila ordering system printer worker',
  script: 'C:\\manila\\printer-service\\src\\worker.js'
});

svc.install();
```

## Testing

### Test Print Job
```bash
# Send test job to Redis queue
redis-cli LPUSH print_queue '{
  "orderId": "test-001",
  "queueNumber": 99,
  "items": [
    {"quantity": 2, "name": "Espresso", "price": 12000}
  ],
  "total": 24000,
  "timestamp": "'$(date -Iseconds)'"
}'
```

### Manual Print Test
```bash
# Direct printer test
cd printer-service
node -e "
import('./src/services/PrinterService.js').then(m => {
  const service = new m.PrinterService();
  service.initialize().then(() => service.testPrint());
});
"
```